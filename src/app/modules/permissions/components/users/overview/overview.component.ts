import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IUserList } from '../../../models/IUserLList.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  userData: IUserData;

  url: string = localStorage.getItem("companyLink") ?? '';

  userdata: any;

  userKeys: string[] = [];

  countUsers: any = { userTotal: 0, countOnlineUser: 0, countOfflineUser: 0 };

  unsubscribe: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {
    let data = authService.userData.subscribe(res => {
      this.userData = res;
      this.getUsersData();
    })

    this.unsubscribe.push(data)
  }

  ngOnInit(): void {
    let bsub = this.userService.bSubject.subscribe(res => this.getUsersData());
    this.unsubscribe.push(bsub);
  }

  getUsersData() {

    this.userService.GetCompanyUsers(this.userData.companyId).subscribe(
      (res: any) => {
        this.userdata = _.groupBy(res, user => user.userType);
        this.userKeys = Object.keys(this.userdata);
      },
      (err) => console.log(err),
      () => { }
    )

  }

  getLength(arr: any, onlineOrNot: boolean) {
    return arr.filter((x: any) => x.onlineOrNot == onlineOrNot)?.length ?? 0
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
