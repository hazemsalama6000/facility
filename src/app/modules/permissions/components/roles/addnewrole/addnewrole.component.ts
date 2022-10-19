import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IManagePermission } from '../../../models/IManagePermission.interface';
import { IRolesProfile } from '../../../models/IRolesProfile.interface';
import { ITreeRoles } from '../../../models/ITreeRoles.interface';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-addnewrole',
  templateUrl: './addnewrole.component.html',
  styleUrls: ['./addnewrole.component.scss']
})
export class AddnewroleComponent implements OnInit {
  loading = false;
  saveButtonClickedFlag = false;

  rolesData: IRolesProfile;
  userData: IUserData;
  treePermissions: ITreeRoles[];
  private unsubscribe: Subscription[] = [];

  roleForm: FormGroup = this.fb.group({
    companyId: [0],
    roleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
  });
  constructor(
    private rolesService: RolesService,
    private authService: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddnewroleComponent>,

  ) {
    let getdata = this.authService.userData.subscribe(res => {
      this.userData = res;
      this.getDefualtPermission();
      this.roleForm.patchValue({ companyId: res.companyId });
    });

    this.unsubscribe.push(getdata);

    let getPermission = rolesService.permissionTree.subscribe(res => this.treePermissions = res);
    this.unsubscribe.push(getPermission);
  }

  ngOnInit(): void { }

  getDefualtPermission() {
    this.rolesService.GetDefaultPermissionForCompany(this.userData.companyId).subscribe(
      (res: ITreeRoles[]) => {
        this.rolesService.permissionTree.next(res);
      },
      (err) => console.log(err),
      () => { }
    )
  }


  addRole() {
    if (this.roleForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.rolesService.AddRole(this.roleForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.managePermissions(data.data.id, data.data.name)
          }
          else if (data.isExists) {
            this.loading = false;
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

  removeParent(arr?: ITreeRoles[]) {
    arr?.map(x => {
      delete x.parent
      if ((x?.children?.length ?? 0) > 0) {
        this.removeParent(x?.children);
      }
    })
  }

  managePermissions(roleId: string, roleName: string) {
    this.removeParent(this.treePermissions)
    let permissions: IManagePermission = { roleId: roleId, roleName: roleName, roleTree: this.treePermissions };
    if (permissions.roleId != null) {
      this.rolesService.PostManagePermission(permissions).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.toaster.openSuccessSnackBar(data.message);
            this.rolesService.bSubject.next(true);
            this.roleForm.reset();
            this.dialogRef.close();
            this.saveButtonClickedFlag = false;
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}


