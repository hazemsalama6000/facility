import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  loading = false;
  roleData: IUserRole = { userId: '', userRoles: [] };
  private unsubscribe: Subscription[] = [];

  constructor(private toaster: toasterService, private usersService: UsersService, public dialogRef: MatDialogRef<AssignrolestousersComponent>,
  ) {
    let data = usersService.userid.subscribe((res) => {
      if (res)
        usersService.getRolesByUserData(res).subscribe(
          (res) => { this.roleData = res; },
          (err) => console.log(err),
          () => { })
    });
    this.unsubscribe.push(data);
  }

  ngOnInit() {

  }

  save() {
    this.loading = true;

    this.usersService.putUserRoles(this.roleData).subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          // console.log(data);
          this.roleData = { userId: '', userRoles: [] }
          this.toaster.openSuccessSnackBar(data.message);
          this.usersService.bSubject.next(true);
          this.dialogRef.close();
        }
        else {
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
