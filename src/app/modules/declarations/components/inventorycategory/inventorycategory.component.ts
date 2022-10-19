import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IInventoryCatecory } from '../../models/IInventoryCatecory.interface';
import { InventorycategoryService } from '../../services/inventorycategory.service';
import { AddinventorycategoryComponent } from './addinventorycategory/addinventorycategory.component';

@Component({
  selector: 'app-inventorycategory',
  templateUrl: './inventorycategory.component.html',
  styleUrls: ['./inventorycategory.component.scss']
})
export class InventorycategoryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n','name', 'state'];
  dataSource: any;
  userdata: IUserData
  page = { PNum: 1, PSize: 10 }
  private unsubscribe: Subscription[] = [];

  constructor(
    private inventorycategoryService: InventorycategoryService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.inventorycategoryService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
  }

  openDialog(model?: IInventoryCatecory) {
    this.dialog.open(AddinventorycategoryComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%',
        data: { inventoryModel: model }
      });
  }

  deleteInventoryCategory(model: IInventoryCatecory) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.inventorycategoryService.deleteInventoryCategory(model.id).subscribe(
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
    this.inventorycategoryService.getInventoryCategory(this.userdata.companyId)
      .subscribe((data: IInventoryCatecory[]) => {
        this.dataSource = new MatTableDataSource<IInventoryCatecory>(data);
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
