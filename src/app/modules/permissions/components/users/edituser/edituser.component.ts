import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/core-module/LookupsServices/branch.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IUsers } from '../../../models/IRolesProfile.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnInit {

  loading: boolean = false;
  isReadOnly: boolean = false;
  saveButtonClickedFlag = false;
  employeeDropdown: LookUpModel[];
  userTypeDropdown: LookUpModel[];
  branchDropdown: LookUpModel[];
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  userForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
    phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
    user_Id: [''],
    branches_Ids: [null, Validators.compose([Validators.required])],
    userType_Id: [null, [Validators.required]],
  });

  constructor(
    private userService: UsersService,
    private auth: AuthService,
    private branchService: BranchService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EdituserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IUsers }
  ) {
    let userdata = this.auth.userData.subscribe(res => {
      this.userData = res;
      this.fillDropdowns();
    });

    this.unsubscribe.push(userdata);

    if (data.user) {
      this.userForm.patchValue({
        user_Id: data.user.id,
        email: data.user.email,
        phone: data.user.phoneNumber,
        userType_Id: data.user.userTypeId,
      })

    }
  }

  ngOnInit() {
  }

  editUser() {
    console.log(this.userForm.value)
    if (this.userForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.userForm.patchValue({ company_Id: this.userData.companyId });
      this.userService.EditUserData(this.userForm.value).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            this.dialogRef.close();
            this.userService.bSubject.next(false)
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

  fillDropdowns() {

    this.userService.getUserTypeData().subscribe((res: LookUpModel[]) => this.userTypeDropdown = res, (err) => console.log(err), () => { });

    this.branchService.getLookupBranchData(this.userData.companyId).subscribe((data: LookUpModel[]) => { this.branchDropdown = data; });

    this.userService.getRUserBranches(this.data.user.id).subscribe(res => {
      let branches: number[] = [];
      res.map(x => branches.push(x.Id));
      this.userForm.patchValue({ branches_Ids: branches });
    })

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}