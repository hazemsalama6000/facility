import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IManagePermission } from '../../../models/IManagePermission.interface';
import { IRolesProfile } from '../../../models/IRolesProfile.interface';
import { ITreeRoles } from '../../../models/ITreeRoles.interface';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-updaterole',
  templateUrl: './updaterole.component.html',
  styleUrls: ['./updaterole.component.scss']
})
export class UpdateroleComponent implements OnInit {
  saveButtonClickedFlag = false;
  loading = false
  rolesData: IRolesProfile;
  treePermissions: ITreeRoles[];
  private unsubscribe: Subscription[] = [];

  roleForm: FormGroup = this.fb.group({
    roleId: [0],
    roleNameNew: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
  });

  constructor(
    private rolesService: RolesService,
    private toaster: toasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateroleComponent>,
  ) {
    let getdata = this.rolesService.roleid.subscribe(res => {
      if (res)
        this.getRoleWithPermission(res);
    });
    this.unsubscribe.push(getdata);

    let getPermission = rolesService.permissionTree.subscribe(res => this.treePermissions = res);
    this.unsubscribe.push(getPermission);
  }

  ngOnInit(): void {
  }

  getRoleWithPermission(roleId: string) {
    this.rolesService.GetPermissionByRole(roleId).subscribe(
      (res: IManagePermission) => {
        this.roleForm.patchValue({ roleId: res.roleId, roleNameNew: res.roleName?.split('_')[1] });
        this.rolesService.permissionTree.next(res.roleTree);

      },
      (err) => console.log(err),
      () => { },
    );
  }

  updateRole() {
    if (this.roleForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.rolesService.UpdateRole(this.roleForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.managePermissions(this.roleForm.get('roleId')?.value, this.roleForm.get('roleNameNew')?.value)
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
      // console.log(this.treePermissions,JSON.stringify(permissions))
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
