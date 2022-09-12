import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IItemsCategory } from '../../../../items/models/itemsCategory/IItemsCategory.interface';
import { ItemsCategoryService } from '../../../../items/services/itemsCategory.service';

@Component({
  selector: 'app-upsertitem',
  templateUrl: './upsertitem.component.html',
  styleUrls: ['./upsertitem.component.scss']
})
export class UpsertitemComponent implements OnInit {

  saveButtonClickedFlag = false;
  userData: IUserData;
  dropdownUnitData: LookUpModel[] = [];
  dropdownCategoryData: LookUpModel[] = [];
  dropdownNatureData: any[] = [];
  private unsubscribe: Subscription[] = [];

  ItemForm: FormGroup = this.fb.group({
    itemId: [0],
    code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    description: [''],
    barCode: [''],

    quantity: [null],
    maxLimit: [null],
    minLimit: [null],
    orderingLimit: [null],

    hasVatTax: [false],
    vatTaxValue: [{ value: null, disabled: true }],

    hasExpireDate: [false],
    expirationDate: [{ value: null, disabled: true }],

    convertedUnitOfMeasure: [false],
    nature: [null],

    itemCategory_Id: [null],
    unit_Id: [null],
    company_Id: [0]
  });

  constructor(
    private itemsCategoryService: ItemsCategoryService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertitemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { node: IItemsCategory, type: string }
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.type != 'add') {
      itemsCategoryService.getItemById(data.node.id).subscribe((res: any) => {

        this.ItemForm.patchValue({
          itemId: [0],
          code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          barCode: [''],
          description: [''],
          hasVatTax: [false],
          vatTaxValue: [0],
          quantity: [0],
          hasExpireDate: [0],
          expirationDate: [''],
          convertedUnitOfMeasure: [false],
          maxLimit: [0],
          minLimit: [0],
          orderingLimit: [0],
          nature: [false],
          itemCategory_Id: [0],
          unit_Id: [0],
          company_Id: [0]
        });

      }, (err) => console.log(err))
    }

  }

  ngOnInit() {
  }

  addItem() {
    console.log(this.ItemForm.value)
    if (this.ItemForm.valid && this.saveButtonClickedFlag) {

      if (this.data.type == 'add') {
        this.ItemForm.patchValue({ itemCategory_Id: this.data.node.id, company_Id: this.userData.companyId });
        this.itemsCategoryService.AddItem(this.ItemForm.value).subscribe(
          (data: HttpReponseModel) => {
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
            console.log(error);
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
          }
        );
      } else {

        this.itemsCategoryService.updateItem(this.ItemForm.value).subscribe(
          (data: HttpReponseModel) => {
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
            console.log(error);
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
          }
        );
      }

    }

  }

  hasExpireDate() {
    let hasDate = this.ItemForm.get('hasExpireDate')?.value;
    if (hasDate) {
      this.ItemForm.get('expirationDate')?.addValidators([Validators.required]);
      this.ItemForm.get('expirationDate')?.enable();
      this.ItemForm.get('expirationDate')?.updateValueAndValidity();
    } else {
      this.ItemForm.patchValue({ expirationDate: null })
      this.ItemForm.get('expirationDate')?.removeValidators([Validators.required]);
      this.ItemForm.get('expirationDate')?.disable();
      this.ItemForm.get('expirationDate')?.updateValueAndValidity();
    }
  }

  hasVatTax() {
    let hasDate = this.ItemForm.get('hasVatTax')?.value;
    if (hasDate) {
      this.ItemForm.get('vatTaxValue')?.addValidators([Validators.required]);
      this.ItemForm.get('vatTaxValue')?.enable();
      this.ItemForm.get('vatTaxValue')?.updateValueAndValidity();
    } else {
      this.ItemForm.patchValue({ vatTaxValue: null })
      this.ItemForm.get('vatTaxValue')?.removeValidators([Validators.required]);
      this.ItemForm.get('vatTaxValue')?.disable();
      this.ItemForm.get('vatTaxValue')?.updateValueAndValidity();
    }
  }

  fillDropdown() {
    // this.itemsCategoryService.getItemById(1).subscribe((res: LookUpModel[]) => this.dropdownCategoryData = res, (err) => console.log(err));
    // this.itemsCategoryService.getItemById(1).subscribe((res: LookUpModel[]) => this.dropdownUnitData = res, (err) => console.log(err));

    this.dropdownNatureData = [{ name: "أصل", value: true }, { name: "مستهلك", value: false }];

  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
