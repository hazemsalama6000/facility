import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ChangepasswordService } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/services/changepassword.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  private unsubscribe: Subscription[] = [];

  changePasswordForm: FormGroup = this.fb.group(
    {
      User_Id: [''],
      OldPassWord: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      NewPassWord: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      ConfirmNewPassWord: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])]
    },
    {
      validators: [Validation.match('NewPassWord', 'ConfirmNewPassWord')]
    }
  );

  constructor(
    private changepasswordService: ChangepasswordService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangepasswordComponent>,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) { }

  ngOnInit() {
  }

  changePassword() {
    console.log(this.changePasswordForm.value)
    console.log(this.changePasswordForm.get('ConfirmNewPassWord')?.errors)

    if (this.changePasswordForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.changePasswordForm.patchValue({ User_Id: this.data.userId });
      this.changepasswordService.changePassword(this.changePasswordForm.value).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            localStorage.clear();
            window.location.reload();
            // this.toaster.openSuccessSnackBar(data.message);
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}