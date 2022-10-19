import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Dialog } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { IUserData } from '../../auth/models/IUserData.interface';
import { ICompany } from '../../hr/models/ICompany';
import { CompanyService } from '../../hr/services/company.service';
import { IUsers } from '../models/IRolesProfile.interface';
import { IUserList } from '../models/IUserLList.interface';
import { UsersService } from '../services/users.service';
import { AddnewroleComponent } from './roles/addnewrole/addnewrole.component';
import { AddnewuserComponent } from './users/addnewuser/addnewuser.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  userData: IUserData;
  companyData: ICompany;
  url: string = localStorage.getItem("companyLink") ?? ""

  countUsers: any = { userTotal: 0, countOnlineUser: 0, countOfflineUser: 0 };

  unsubscribe: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private userService: UsersService,
    private dialog: MatDialog
  ) {
    let data = authService.userData.subscribe(res => {
      this.userData = res;
      this.getCompanyData();
      this.getUsersData();
    })

    this.unsubscribe.push(data);
    this.url = localStorage.getItem("companyLink") ?? '';
  }

  getCompanyData() {
    this.companyService.getCompanyDataById(this.userData.companyId).subscribe(
      (res: ICompany) => { this.companyData = res; },
      (err) => console.log(err),
      () => { }
    )
  }

  getUsersData() {
    this.userService.GetCompanyUsers(this.userData.companyId).subscribe(
      (res: IUsers[]) => {
        console.log('permission')
        this.userService.usersList.next(res);
        this.countUsers.userTotal = res.length;
        this.countUsers.countOnlineUser = res.filter(x => x.onlineOrNot).length;
        this.countUsers.countOfflineUser = res.filter(x => !x.onlineOrNot).length;
      },
      (err) => console.log(err),
      () => { }
    )
  }

  openDialogAddUser() {
    this.dialog.open(AddnewuserComponent, {
      width: '80vw',
      height: '100vh',
      position: { right: '0' },
    })
  }

  openDialogAddRole() {
    this.dialog.open(AddnewroleComponent, {
      width: '80vw',
      height: '100vh',
      position: { right: '0' },
    })
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
