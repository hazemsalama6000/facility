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
import { IVendorActivity } from '../../models/IVendorActivity.interface';
import { VendoractivityService } from '../../services/vendoractivity.service';
import { UpsertvendoractivityComponent } from './upsertvendoractivity/upsertvendoractivity.component';

@Component({
  selector: 'app-vendoractivity',
  templateUrl: './vendoractivity.component.html',
  styleUrls: ['./vendoractivity.component.scss']
})
export class VendoractivityComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['code','name', 'state'];
  dataSource: any;
  userdata: IUserData
  private unsubscribe: Subscription[] = [];

  constructor(
    private vendoractivityService: VendoractivityService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.vendoractivityService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
  }

  openDialog(model?: IVendorActivity) {
    this.dialog.open(UpsertvendoractivityComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%',
        data: { model: model }
      });
  }

  deleteVendorActivity(model: IVendorActivity) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.vendoractivityService.deleteActivity(model.id).subscribe(
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
    this.vendoractivityService.getActivity(this.userdata.branchId)
      .subscribe((data: IVendorActivity[]) => {
        this.dataSource = new MatTableDataSource<IVendorActivity>(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
