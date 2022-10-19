import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IUsers } from '../../../models/IRolesProfile.interface';
import { IUserList } from '../../../models/IUserLList.interface';
import { UsersService } from '../../../services/users.service';
import { AddnewuserComponent } from '../addnewuser/addnewuser.component';
import { AssignrolestousersComponent } from '../assignrolestousers/assignrolestousers.component';
import { EdituserComponent } from '../edituser/edituser.component';

@Component({
  selector: 'app-getusers',
  templateUrl: './getusers.component.html',
  styleUrls: ['./getusers.component.scss']
})
export class GetusersComponent implements OnInit, OnDestroy {
  usersList: IUsers[];
  userData: IUserData;

  private unsubscribe: Subscription[] = [];

  url: string = localStorage.getItem("companyLink") ?? ""


  constructor(
    private userservice: UsersService,
    private authservice: AuthService,
    private toaster: toasterService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,

  ) {
    let getdata = this.authservice.userData.subscribe(
      res => {
        this.userData = res;
        let user = userservice.bSubject.subscribe(res => this.getUserData());
        this.unsubscribe.push(user)
      });

    this.unsubscribe.push(getdata);

    this.url = localStorage.getItem("companyLink") ?? '';
  }

  ngOnInit(): void { }

  getUserData(search: string = '') {
    if (search.length > 0) {
      this.userservice.GetCompanyUsers(this.userData.companyId, search).subscribe(
        (res: IUsers[]) => { this.usersList = res; console.log('getUsers') },
        (err) => console.log(err),
        () => { }
      )
    } else {
      let data = this.userservice.usersList.subscribe(res => { this.usersList = res; console.log('sub getUsers') })
      this.unsubscribe.push(data)
    }

  }

  getUserWithFiltter(search: string) {
    this.getUserData(`?UserName=${search}`);
  }

  resetPassword(event: Event, user: IUsers) {
    this.confirmationService.confirm({
      target: event.target || undefined,
      defaultFocus: 'none',
      acceptLabel: 'موافق',
      rejectLabel: 'ألغاء',
      message: 'هل تريد استعادة كلمة المرور؟',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userservice.resetPassword(user.id).subscribe(
          (data: HttpReponseModel) => { this.toaster.openSuccessSnackBar(data.message); },
          (error: any) => { this.toaster.openWarningSnackBar(error.toString().replace("Error:", "")); }
        );
      },
      reject: () => { console.log('rejected') }
    });

  }

  toggleActiveDeactive(event: Event, user: IUsers, index: number) {

    this.userservice.activeOrNot(user.id).subscribe(
      (data: HttpReponseModel) => {
        this.toaster.openSuccessSnackBar(data.message);
        this.getUserData();
      },
      (error: any) => {
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      });
  }

  assignUserIdToRole(user: IUsers) {
    this.userservice.userid.next(user.id);
    this.dialog.open(AssignrolestousersComponent, {
      height: '100vh',
      minWidth: '40vw',
      width: "40vw",
      position: { right: '0' },
      data: { user: user }
    })
  }

  editUser(user: IUsers) {
    this.dialog.open(EdituserComponent, {
      height: '100vh',
      minWidth: '50vw',
      width: "60vw",
      position: { right: '0' },
      data: { user: user }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
