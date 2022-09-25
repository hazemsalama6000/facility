import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IVendorActivity } from '../../../models/IVendorActivity.interface';
import { VendoractivityService } from '../../../services/vendoractivity.service';

@Component({
  selector: 'app-upsertvendoractivity',
  templateUrl: './upsertvendoractivity.component.html',
  styleUrls: ['./upsertvendoractivity.component.scss']
})
export class UpsertvendoractivityComponent implements OnInit {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  isEdit: boolean = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  activityForm: FormGroup = this.fb.group({
    Id: [0],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    branch_Id: [0],
  });

  constructor(
    private vendoractivityService: VendoractivityService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertvendoractivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: IVendorActivity },
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.model) {
      this.isEdit = true;
      this.activityForm.patchValue({ Id: data.model.id, name: data.model.name, code: data.model.code, branch_Id: data.model.branch_Id });
    }
  }

  ngOnInit() {
  }

  UpsertVendorActivity() {
    console.log(this.activityForm.value)
    if (this.activityForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.activityForm.patchValue({ branch_Id: this.userData.branchId });
      if (this.isEdit) {
        this.vendoractivityService.updateActivity(this.activityForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendoractivityService.bSubject.next(false);
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
        this.activityForm.patchValue({ branch_Id: this.userData.branchId });

        this.vendoractivityService.addActivity(this.activityForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendoractivityService.bSubject.next(false);
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
