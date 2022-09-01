import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { InventoryService } from '../../../services/inventory.service';
import { InventorycategoryService } from '../../../services/inventorycategory.service';

@Component({
  selector: 'app-addinventory',
  templateUrl: './addinventory.component.html',
  styleUrls: ['./addinventory.component.scss']
})
export class AddinventoryComponent {


  saveButtonClickedFlag = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];
  dropdownEmployeeData: LookUpModel[] = [];
  dropdownStockCategoryData: LookUpModel[] = [];


  stockForm: FormGroup = this.fb.group({
    id: [0],
    code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    employeeId: [null, Validators.compose([Validators.required])],
    stockCategory_Id: [null, Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required])],
    branch_Id: [0, Validators.compose([Validators.required])]
  });


  constructor(
    private inventoryService: InventoryService,
    private employeeService: EmployeeService,
    private inventorycategoryService: InventorycategoryService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddinventoryComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => { this.userData = res });
    this.unsubscribe.push(udata);

    this.fillDropdownList();
  }

  addStock() {

    if (this.stockForm.valid && this.saveButtonClickedFlag) {
      this.stockForm.patchValue({ branch_Id: this.userData.branchId });
      this.inventoryService.addInventory(this.stockForm.value).subscribe(
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
        }
      );
    }

  }

  fillDropdownList() {
    this.employeeService.getLookupEmployeeData(this.userData.companyId).subscribe(
      (res: LookUpModel[]) => this.dropdownEmployeeData = res,
      (err) => console.log(err),
      () => { });

    this.inventorycategoryService.getLookUpInventoryCategory(this.userData.companyId).subscribe(
      (res: LookUpModel[]) => this.dropdownStockCategoryData = res,
      (err) => console.log(err),
      () => { });
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
