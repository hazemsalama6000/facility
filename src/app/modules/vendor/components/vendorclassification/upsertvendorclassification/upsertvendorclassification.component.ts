import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IVendorClassification } from '../../../models/IVenndorClassification.interface';
import { VendorclassificationService } from '../../../services/vendorclassification.service';

@Component({
  selector: 'app-upsertvendorclassification',
  templateUrl: './upsertvendorclassification.component.html',
  styleUrls: ['./upsertvendorclassification.component.scss']
})
export class UpsertvendorclassificationComponent implements OnInit {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  isEdit: boolean = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  classificationForm: FormGroup = this.fb.group({
   Id: [0],
   name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
   isExternalPlace: [false],
   branch_Id: [0],
  });

  constructor(
    private vendorclassificationService: VendorclassificationService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertvendorclassificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: IVendorClassification },
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.model) {
      this.isEdit = true;
      this.classificationForm.patchValue({Id: data.model.id,name: data.model.name,isExternalPlace:data.model.isExternalPlace});
    }
  }

  ngOnInit() {
  }

  UpsertVendorClassification() {
    console.log(this.classificationForm.value)
    if (this.classificationForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.classificationForm.patchValue({ branch_Id: this.userData.companyId });
      if (this.isEdit) {
        this.vendorclassificationService.updateClassification(this.classificationForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendorclassificationService.bSubject.next(false);
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
        this.vendorclassificationService.addClassification(this.classificationForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendorclassificationService.bSubject.next(false);
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
