import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IInventory } from '../../models/IInventory.interface';
import { InventoryService } from '../../services/inventory.service';
import { AddinventoryComponent } from './addinventory/addinventory.component';
import { AddstocktechComponent } from './addstocktech/addstocktech.component';
import { AssigntechtoinventoryComponent } from './assigntechtoinventory/assigntechtoinventory.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  addButton: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['code', 'name', 'category', 'technician', 'address', 'status', 'action'];
  dataSource: any;
  userdata: IUserData
  private unsubscribe: Subscription[] = [];

  constructor(
    private inventoryService: InventoryService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
    private confirmationService: ConfirmationService
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.inventoryService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
  }

  getallData() {
    this.inventoryService.getInventory(this.userdata.branchId).subscribe((data: IInventory[]) => {
      console.log(data)
      this.dataSource = new MatTableDataSource<IInventory>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteInventory(event: Event, model: IInventory) {
    this.confirmationService.confirm({
      target: event.target || undefined,
      defaultFocus: 'none',
      acceptLabel: 'موافق',
      rejectLabel: 'ألغاء',
      message: 'هل تريد حذف المخزن؟',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.deleteInventory(model.id).subscribe(
          (data: HttpReponseModel) => { 
            this.inventoryService.bSubject.next(false);
            this.toaster.openSuccessSnackBar(data.message);
           },
          (error: any) => { this.toaster.openWarningSnackBar(error.toString().replace("Error:", "")); }
        );
      },
      reject: () => { console.log('rejected') }
    });
  }

  toggleActiveDeactive(model: IInventory) {
    let stmt = model.isActive ? 'ايقاف تفعيل' : 'تفعيل';
    this.confirmationDialogService.confirm(`من فضلك اكد ${stmt}`, `هل تريد ${stmt} ${model.stockName} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.inventoryService.toggelIsActiveInventory(model.id).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.getallData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        }else
        this.getallData();
      })
      .catch(() => {this.getallData();console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')});
  }

  openAddDialog(model?: IInventory) {
    this.dialog.open(AddinventoryComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%', data: { model: model } });
  }

  openAssignDialog(model: IInventory) {
    this.dialog.open(AssigntechtoinventoryComponent, { maxHeight: '100vh', width: '50%', data: { model: model } });
  }

  openStockTechDialog(model: IInventory) {
    this.dialog.open(AddstocktechComponent, { maxHeight: '100vh', width: '50%', data: { model: model } });
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
