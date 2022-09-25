import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IItemsCategory } from '../../../../items/models/itemsCategory/IItemsCategory.interface';
import { ItemsCategoryService } from '../../../../items/services/itemsCategory.service';

@Component({
  selector: 'app-upsertcategory',
  templateUrl: './upsertcategory.component.html',
  styleUrls: ['./upsertcategory.component.scss']
})
export class UpsertcategoryComponent implements OnInit {
  loading: boolean = false;
  saveButtonClickedFlag = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  categoryForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    company_Id: [0],
    parentId: [0]
  });

  constructor(
    private itemsCategoryService: ItemsCategoryService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { node: IItemsCategory, type: string }
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.type != 'add') {
      this.categoryForm.patchValue({
        id: data.node.id,
        name: data.node.name,
        company_Id: this.userData.companyId,
        parentId: data.node.parentId
      });
    }

  }

  ngOnInit() {
  }

  addCategory() {
    console.log(this.categoryForm.value)
    if (this.categoryForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      if (this.data.type == 'add') {
        this.categoryForm.patchValue({ parentId: this.data.node.id, company_Id: this.userData.companyId });
        this.itemsCategoryService.Addcategory(this.categoryForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.itemsCategoryService.bSubject.next(false);
              this.dialogRef.close();
              this.toaster.openSuccessSnackBar(data.message);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
          },
          (error: any) => {
            this.loading = false;
            console.log(error);
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
          }
        );
      } else {

        this.itemsCategoryService.updateCategory(this.categoryForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.itemsCategoryService.bSubject.next(false);
              this.dialogRef.close();
              this.toaster.openSuccessSnackBar(data.message);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
          },
          (error: any) => {
            this.loading = false;
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
