import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IRole, IUserRole } from '../../../models/IUserRole.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-assignrolestousers',
  templateUrl: './assignrolestousers.component.html',
  styleUrls: ['./assignrolestousers.component.scss']
})
export class AssignrolestousersComponent implements OnInit {

  @ViewChild('btnClose') btnClose: ElementRef<HTMLElement>;

  roleData: IUserRole = { userId: '', userRoles: [] };
  private unsubscribe: Subscription[] = [];

  constructor(private toaster: toasterService, private usersService: UsersService) {
    let data = usersService.userid.subscribe((res) => {
      if (res)
        usersService.getRolesByUserData(res).subscribe(
          (res) =>{ this.roleData = res;},
          (err) => console.log(err),
          () => { })
    });
    this.unsubscribe.push(data);
  }

  ngOnInit() {

  }

  save() {
    this.usersService.putUserRoles(this.roleData).subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          // console.log(data);
          this.roleData = { userId: '', userRoles: [] }
          this.toaster.openSuccessSnackBar(data.message);
          this.btnClose.nativeElement.click();
        }
        else {
          this.toaster.openWarningSnackBar(data.message);
        }
      },
      (error: any) => {
        console.log(error);
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
