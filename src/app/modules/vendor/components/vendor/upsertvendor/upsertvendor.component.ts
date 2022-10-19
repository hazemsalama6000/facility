import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IVendor } from '../../../models/IVendor.interface';
import { VendorService } from '../../../services/vendor.service';
import { VendoractivityService } from '../../../services/vendoractivity.service';
import { VendorclassificationService } from '../../../services/vendorclassification.service';
import { VendormiancompanyService } from '../../../services/vendormiancompany.service';

@Component({
  selector: 'app-upsertvendor',
  templateUrl: './upsertvendor.component.html',
  styleUrls: ['./upsertvendor.component.scss']
})
export class UpsertvendorComponent implements OnInit {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  isEdit: boolean = false;
  userData: IUserData;
  taxOffice: LookUpModel[] = [];
  classification: LookUpModel[] = [];
  activity: LookUpModel[] = [];
  mainCompany: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  vendorForm: FormGroup = this.fb.group({
    id: [0],
    code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    isActive: [false],

    classification_Id: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    mainCompany_Id: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    activity_Id: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    taxOffice_Id: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

    telephone: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
    mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
    email: ['', Validators.compose([ Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
    site: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

    commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(12)])],
    taxFileNum: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    isWithHoldTaxActive: [false],
    withHoldTax: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
    isVatTaxActive: [false],
    vatTax: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],

    branch_Id: [0],
  });

  constructor(
    private vendorService: VendorService,
    private activityService: VendoractivityService,
    private classificationService: VendorclassificationService,
    private mainCompanyService: VendormiancompanyService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertvendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: IVendor },
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.model) {
      this.isEdit = true;
      this.vendorForm.patchValue({
        id: data.model.id,
        code: data.model.code,
        name: data.model.name,
        address: data.model.address,
        telephone: data.model.telephone,
        mobile: data.model.mobile,
        commercialRecord:data.model.commercialRecord,
        taxFileNum: data.model.taxFileNum,
        email: data.model.email,
        site: data.model.site,
        vatTax: data.model.vatTax,
        isVatTaxActive: data.model.isVatTaxActive,
        withHoldTax: data.model.withHoldTax,
        isWithHoldTaxActive: data.model.isWithHoldTaxActive,
        isActive: data.model.isActive,
        classification_Id: data.model.classification_Id,
        mainCompany_Id: data.model.mainCompany_Id,
        activity_Id: data.model.activity_Id,
        taxOffice_Id: data.model.taxOffice_Id,
        branch_Id: data.model.branch_Id
      });
    }
  }

  ngOnInit() {
    this.filldropdown();
  }


  filldropdown() {
    this.mainCompanyService.getLookUpMainCompany(this.userData.companyId).subscribe(res => this.mainCompany = res);
    this.activityService.getLookUpActivity(this.userData.companyId).subscribe(res => this.activity = res);
    this.classificationService.getLookUpClassification(this.userData.companyId).subscribe(res => this.classification = res);
    this.vendorService.getLookUpTaxOffice().subscribe(res => this.taxOffice = res);
  }


  UpsertVendorActivity() {
    if (this.vendorForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.vendorForm.patchValue({ branch_Id: this.userData.branchId });
      if (this.isEdit) {
        console.log(JSON.stringify(this.vendorForm.value))
        this.vendorService.updateVendor(this.vendorForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendorService.bSubject.next(false);
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
        this.vendorForm.patchValue({ branch_Id: this.userData.branchId });

        this.vendorService.addVendor(this.vendorForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendorService.bSubject.next(false);
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
