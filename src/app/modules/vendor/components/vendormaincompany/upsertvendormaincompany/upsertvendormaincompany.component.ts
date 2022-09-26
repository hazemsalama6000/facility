import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IVendorMainCompany } from '../../../models/IVendorMainCompany.interface';
import { VendormiancompanyService } from '../../../services/vendormiancompany.service';

@Component({
  selector: 'app-upsertvendormaincompany',
  templateUrl: './upsertvendormaincompany.component.html',
  styleUrls: ['./upsertvendormaincompany.component.scss']
})
export class UpsertvendormaincompanyComponent implements OnInit {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  isEdit: boolean = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  mainCompanyForm: FormGroup = this.fb.group({
    Id: [0],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    branch_Id: [0],
  });

  constructor(
    private vendormiancompanyService: VendormiancompanyService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpsertvendormaincompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: IVendorMainCompany },
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.model) {
      this.isEdit = true;
      this.mainCompanyForm.patchValue({ Id: data.model.id, name: data.model.name, code: data.model.code, branch_Id: data.model.branch_Id });
    }
  }

  ngOnInit() {
  }

  UpsertVendorMainCompany() {
    console.log(this.mainCompanyForm.value)
    if (this.mainCompanyForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.mainCompanyForm.patchValue({ branch_Id: this.userData.branchId });
      if (this.isEdit) {
        this.vendormiancompanyService.updateMainCompany(this.mainCompanyForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendormiancompanyService.bSubject.next(false);
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
        this.mainCompanyForm.patchValue({ branch_Id: this.userData.branchId });

        this.vendormiancompanyService.addMainCompany(this.mainCompanyForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.vendormiancompanyService.bSubject.next(false);
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
