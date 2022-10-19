import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { AddinventorycategoryComponent } from 'src/app/modules/declarations/components/inventorycategory/addinventorycategory/addinventorycategory.component';
import { IInventoryCatecory } from 'src/app/modules/declarations/models/IInventoryCatecory.interface';
import { InventorycategoryService } from 'src/app/modules/declarations/services/inventorycategory.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IVendorClassification } from '../../models/IVenndorClassification.interface';
import { VendorclassificationService } from '../../services/vendorclassification.service';
import { UpsertvendorclassificationComponent } from './upsertvendorclassification/upsertvendorclassification.component';

@Component({
  selector: 'app-vendorclassification',
  templateUrl: './vendorclassification.component.html',
  styleUrls: ['./vendorclassification.component.scss']
})
export class VendorclassificationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n','name', 'isExternalPlace', 'state','action'];
  dataSource: any;
  page = { PNum: 1, PSize: 10 }
  userdata: IUserData
  private unsubscribe: Subscription[] = [];

  constructor(
    private vendorclassificationService: VendorclassificationService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.vendorclassificationService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
  }

  openDialog(model?: IVendorClassification) {
    this.dialog.open(UpsertvendorclassificationComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%',
        data: { model: model }
      });
  }

  deleteVendorClassification(model: IVendorClassification) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.vendorclassificationService.deleteClassification(model.id).subscribe(
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

  toggleActiveDeactive(model: IVendorClassification) {
    let msg = model.name ? 'ايقاف' : ''
    this.confirmationDialogService.confirm(`من فضلك اكد ${msg} التفعيل`, `هل تريد ${msg} تفعيل ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.vendorclassificationService.toggleActiveDeactive(model.id).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.getallData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        } else
          this.getallData();
      })
      .catch(() => { this.getallData(); console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)') });
  }



  // getting data and initialize data Source and Paginator
  getallData() {
    this.vendorclassificationService.getClassification(this.userdata.branchId)
      .subscribe((data: IVendorClassification[]) => {
        this.dataSource = new MatTableDataSource<IVendorClassification>(data);
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
