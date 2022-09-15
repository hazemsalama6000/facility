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
import { IItem } from '../../../models/itemsCategory/IItem.interface';
import { UnitService } from '../../../services/units.service';

@Component({
  selector: 'app-upsertitem',
  templateUrl: './upsertitem.component.html',
  styleUrls: ['./upsertitem.component.scss']
})
export class UpsertitemComponent {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  userData: IUserData;
  dropdownUnitData: LookUpModel[] = [];
  dropdownCategoryData: LookUpModel[] = [];
  dropdownNatureData: any[] = [];
  private unsubscribe: Subscription[] = [];

  ItemForm: FormGroup = this.fb.group({
    Id: [0],
    code: ['', Validators.compose([Validators.required])],
    name: ['', Validators.compose([Validators.required])],
    description: [''],
    barCode: [''],
    maxLimit: [null, Validators.compose([Validators.required])],
    minLimit: [null, Validators.compose([Validators.required])],
    orderingLimit: [null, Validators.compose([Validators.required])],
    hasVatTax: [false],
    vatTaxValue: [{ value: null, disabled: true }],
    hasExpireDate: [false],
    convertedUnitOfMeasure: [false],
    nature: [null, Validators.compose([Validators.required])],
    itemCategory_Id: [null],
    unit_Id: [null],
    company_Id: [0]
  });

  constructor(
    private itemsCategoryService: ItemsCategoryService,
    private unitService: UnitService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertitemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { node: IItemsCategory, type: string }
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);
    this.fillDropdown();

    if (data.type != 'add') {
      itemsCategoryService.getItemById(data.node.id).subscribe((res: IItem) => {

        this.ItemForm.patchValue({
          Id: res.id,
          code: res.code,
          name: res.name,
          barCode: res.barCode,
          description: res.description,
          hasVatTax: res.hasVatTax,
          vatTaxValue: res.vatTaxValue,
          hasExpireDate: res.hasExpireDate,
          convertedUnitOfMeasure: res.convertedUnitOfMeasure,
          maxLimit: res.maxLimit,
          minLimit: res.minLimit,
          orderingLimit: res.orderingLimit,
          nature: res.nature,
          itemCategory_Id: res.itemCategory_Id,
          unit_Id: res.unit_Id,
          company_Id: res.company_Id
        });

      }, (err) => console.log(err))
    }

  }


  addItem() {
    console.log(this.ItemForm.value, this.ItemForm.valid)
    if (this.ItemForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      if (this.data.type == 'add') {
        this.ItemForm.patchValue({ Id: this.data.node.id, itemCategory_Id: this.data.node.id, company_Id: this.userData.companyId });
        console.log(this.ItemForm.value)
        this.itemsCategoryService.AddItem(this.ItemForm.value).subscribe(
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

        this.itemsCategoryService.updateItem(this.ItemForm.value).subscribe(
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
    this.unitService.getLookUpUnits(this.userData.companyId).subscribe((res: LookUpModel[]) => this.dropdownUnitData = res, (err) => console.log(err));

    this.dropdownNatureData = [{ name: "أصل", value: true }, { name: "مستهلك", value: false }];

  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
