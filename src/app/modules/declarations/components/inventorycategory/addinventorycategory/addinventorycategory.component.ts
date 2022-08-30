import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IInventoryCatecory } from '../../../models/IInventoryCatecory.interface';
import { InventorycategoryService } from '../../../services/inventorycategory.service';

@Component({
  selector: 'app-addinventorycategory',
  templateUrl: './addinventorycategory.component.html',
  styleUrls: ['./addinventorycategory.component.scss']
})
export class AddinventorycategoryComponent implements OnInit {

  saveButtonClickedFlag = false;
  isEdit:boolean=false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  invForm: FormGroup = this.fb.group({
    stockcategoryId: [0],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    company_Id:[0],
  });

  constructor(
    private inventorycategoryService: InventorycategoryService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddinventorycategoryComponent>, 
       @Inject(MAT_DIALOG_DATA) public data: { inventoryModel: IInventoryCatecory },
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.inventoryModel) {
      this.isEdit = true;
      this.invForm.patchValue({
        stockcategoryId: data.inventoryModel.id,
        name: data.inventoryModel.name,
      });
    }
  }

  ngOnInit() {
  }

  UpsertInventoryCategory() {
    console.log(this.invForm.value)
    if (this.invForm.valid && this.saveButtonClickedFlag) {
      this.invForm.patchValue({company_Id:this.userData.companyId});
      if (this.isEdit) {
             this.inventorycategoryService.updateInventoryCategory(this.invForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.inventorycategoryService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          console.log(error);
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      );
      } else {
            this.inventorycategoryService.addInventoryCategory(this.invForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.inventorycategoryService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          console.log(error);
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      ); 
      }
 
    }

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
