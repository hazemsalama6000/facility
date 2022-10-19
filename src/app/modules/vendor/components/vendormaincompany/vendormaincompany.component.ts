import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IVendorMainCompany } from '../../models/IVendorMainCompany.interface';
import { VendormiancompanyService } from '../../services/vendormiancompany.service';
import { UpsertvendormaincompanyComponent } from './upsertvendormaincompany/upsertvendormaincompany.component';

@Component({
  selector: 'app-vendormaincompany',
  templateUrl: './vendormaincompany.component.html',
  styleUrls: ['./vendormaincompany.component.scss']
})
export class VendormaincompanyComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n','code', 'name', 'state'];
  dataSource: any;
  userdata: IUserData;
  page = { PNum: 1, PSize: 10 }
  private unsubscribe: Subscription[] = [];

  constructor(
    private vendormiancompanyService: VendormiancompanyService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.vendormiancompanyService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() { }

  openDialog(model?: IVendorMainCompany) {
    this.dialog.open(UpsertvendormaincompanyComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%',
        data: { model: model }
      });
  }

  deleteVendorActivity(model: IVendorMainCompany) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.vendormiancompanyService.deleteMainCompany(model.id).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.getallData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  // getting data and initialize data Source and Paginator
  getallData() {
    this.vendormiancompanyService.getMainCompany(this.userdata.branchId)
      .subscribe((data: IVendorMainCompany[]) => {
        this.dataSource = new MatTableDataSource<IVendorMainCompany>(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageEvent(event: any) {
    this.page.PSize = event.pageSize;
    this.page.PNum = event.pageIndex + 1;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  
}
