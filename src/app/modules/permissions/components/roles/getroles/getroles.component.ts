import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IRoles, IRolesProfile } from '../../../models/IRolesProfile.interface';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-getroles',
  templateUrl: './getroles.component.html',
  styleUrls: ['./getroles.component.scss']
})
export class GetrolesComponent implements OnInit {

  rolesData: IRolesProfile;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private rolesService: RolesService,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private toaster: toasterService
  ) {
    let getdata = this.authService.userData.subscribe(
      res => {
        this.userData = res;
        this.getRolesData();
      });

    this.unsubscribe.push(getdata);
  }

  ngOnInit(): void {
    let changeData = this.rolesService.bSubject.subscribe(res => {this.getRolesData();});
    this.unsubscribe.push(changeData);
  }

  getRolesData() {
    this.rolesService.GetRolesDetailsForCompany(this.userData.companyId).subscribe(
      (res) => this.rolesData = res,
      (err) => console.log(err),
      () => { }
    );

  }

  editRole(roleId: string) {
    this.rolesService.roleid.next(roleId);
  }

  deleteRole(model: IRoles) {
    this.rolesService.bSubject.next(false);

    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.roleName} ? `)
      .then((confirmed) => {
        if (confirmed) {
          this.rolesService.DeleteRole(model.roleId).subscribe(
            (data: HttpReponseModel) => {

              this.toaster.openSuccessSnackBar(data.message);
              this.getRolesData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
