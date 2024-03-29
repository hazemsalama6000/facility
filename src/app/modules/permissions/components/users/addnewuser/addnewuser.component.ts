import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/core-module/LookupsServices/branch.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { JobService } from 'src/app/modules/share/Services/job.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-addnewuser',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.scss']
})
export class AddnewuserComponent implements OnInit, OnDestroy {
  saveButtonClickedFlag = false;
  loading = false;
  employeeDropdown: LookUpModel[];
  userTypeDropdown: LookUpModel[];
  branchDropdown: LookUpModel[];
  rolesData: any[];
  userData: IUserData;

  userDataForm: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    userName: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
    email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
    phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
    company_Id: [null, [Validators.required]],
    branch_Ids: [null, Validators.compose([Validators.required])],
    userType_Id: [null, [Validators.required]],
    addingRoles: this.fb.array([])
  });

  private unsubscribe: Subscription[] = [];
  constructor(
    private userservice: UsersService,
    private authservice: AuthService,
    private branchService: BranchService,
    private toaster: toasterService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddnewuserComponent>,

  ) {
    let data = this.authservice.userData.subscribe(res => {
      this.userData = res;
      this.fillDropdowns();
      this.userDataForm.patchValue({ company_Id: res.companyId });
    });

    this.unsubscribe.push(data);

  }

  ngOnInit(): void { }

  fillDropdowns() {
    this.employeeService.getLookupEmployeeData(this.userData.companyId).subscribe(
      (data: LookUpModel[]) => this.employeeDropdown = data,
      (err) => console.log(err),
      () => { }
    );

    this.userservice.getRolesByCompanyData(this.userData.companyId).subscribe(
      (res: LookUpModel[]) => { this.rolesData = res; },
      (err) => console.log(err),
      () => { }
    );

    this.userservice.getUserTypeData().subscribe(
      (res: LookUpModel[]) => this.userTypeDropdown = res,
      (err) => console.log(err),
      () => { }
    );

    this.branchService.getLookupBranchData(this.userData.companyId).subscribe((data: LookUpModel[]) => { this.branchDropdown = data; });

  }

  Submit() {
    if (this.userDataForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.userservice.PostUserData(this.userDataForm.value).
        subscribe(
          (data: HttpReponseModel) => {

            if (data.isSuccess) {
              this.toaster.openSuccessSnackBar(data.message);
              this.userservice.bSubject.next(true);
              this.dialogRef.close();
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            console.log(error);
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
          }
        );

    }

  }

  onCheckboxChange(e: any) {
    const addingRoles: FormArray = this.userDataForm.get('addingRoles') as FormArray;
    if (e.target.checked) {
      addingRoles.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      addingRoles.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          addingRoles.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
