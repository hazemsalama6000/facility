import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IInventory } from '../../../models/IInventory.interface';
import { IStockTechnique } from '../../../models/IStockTechnique.interface';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-addstocktech',
  templateUrl: './addstocktech.component.html',
  styleUrls: ['./addstocktech.component.scss']
})
export class AddstocktechComponent {
  canAdd: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['stockTechniqueName', 'activateDate', 'deactivateDate', 'deActivateBy', 'state'];
  dataSource: any;

  saveButtonClickedFlag = false;
  userData: IUserData;
  dropdownTechniqueData: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  carAssignForm: FormGroup = this.fb.group({
    stock_Id: [0],
    stockTechnique_Id: [null, [Validators.required]],
  });

  constructor(
    private inventoryService: InventoryService,
    private auth: AuthService,
    private toaster: toasterService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { model: IInventory },
    public dialogRef: MatDialogRef<AddstocktechComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);
    this.getTechnique();
    this.getallData()
  }


  addAssignToStock() {
    if (this.carAssignForm.valid && this.saveButtonClickedFlag) {
      this.carAssignForm.patchValue({ stock_Id: this.data.model.id });
      this.inventoryService.AddStockTechnique(this.carAssignForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.inventoryService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        });
    }
  }

  stopStockTech(event: Event, model: IStockTechnique) {
    this.confirmationService.confirm({
      target: event.target || undefined,
      defaultFocus: 'none',
      acceptLabel: 'موافق',
      rejectLabel: 'ألغاء',
      message: 'هل تريد ايقاف طريقة الصرف؟',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.stopStockTechnique({ stock_Id: this.data.model.id, user_Id: this.userData.userId }).subscribe(
          (data: HttpReponseModel) => {
            this.inventoryService.bSubject.next(false);
            this.canAdd=false;
            this.toaster.openSuccessSnackBar(data.message);
          },
          (error: any) => { this.toaster.openWarningSnackBar(error.toString().replace("Error:", "")); }
        );
      },
      reject: () => { console.log('rejected') }
    });
  }

  getTechnique() {
    this.inventoryService.getLookUpStockTechnique().subscribe(
      (res: LookUpModel[]) => this.dropdownTechniqueData = res,
      (err) => console.log(err),
      () => { });
  }

  // getting data and initialize data Source and Paginator
  getallData() {
    this.inventoryService.getStockTechniqueLogs(this.data.model.id).subscribe((data: IStockTechnique[]) => {
      this.dataSource = new MatTableDataSource<IStockTechnique>(data);
      this.dataSource.paginator = this.paginator;
      this.canAdd = data.filter((x) => x.isActive).length == 0;

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
