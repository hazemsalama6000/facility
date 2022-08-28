import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { FinancialyearService } from '../../../services/financialyear.service';

@Component({
  selector: 'app-addfinancialyear',
  templateUrl: './addfinancialyear.component.html',
  styleUrls: ['./addfinancialyear.component.scss']
})
export class AddfinancialyearComponent implements OnInit {

  saveButtonClickedFlag = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  financialForm: FormGroup = this.fb.group({
    id: [0],
    year: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    startDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    endDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    company_Id:[0],
    isActive:[true]
  });

  constructor(
    private financial: FinancialyearService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddfinancialyearComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
  }

  addFinancialYear() {
    console.log(this.financialForm.value)
    if (this.financialForm.valid && this.saveButtonClickedFlag) {
      this.financialForm.patchValue({company_Id:this.userData.companyId});
      this.financial.AddFinancialYear(this.financialForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.financial.bSubject.next(false);
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
