import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IRoles, IRolesProfile } from '../../../models/IRolesProfile.interface';
import { RolesService } from '../../../services/roles.service';
import { UpdateroleComponent } from '../updaterole/updaterole.component';

@Component({
  selector: 'app-roleprofile',
  templateUrl: './roleprofile.component.html',
  styleUrls: ['./roleprofile.component.scss']
})
export class RoleprofileComponent implements OnInit {

  roleData!: IRoles;
  roleId: string;
  userData: IUserData;
  unsubscribe: Subscription[] = [];
  url: string = localStorage.getItem("companyLink") ?? ""


  constructor(
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private rolesService: RolesService,
    private dialog:MatDialog
  ) {
    this.url = localStorage.getItem("companyLink") ?? '';
    let userDatasub = this.authService.userData.subscribe(res => {
      this.userData = res;
      let queryParams = this.activatedRoute.queryParams.subscribe((params) => {
        if (params.roleId) {
          this.roleId = params.roleId;
          this.getRolesData(params.roleId);
        } else
          this.router.navigate(['/permissions/roles']);
      });

      this.unsubscribe.push(queryParams)
    })
    this.unsubscribe.push(userDatasub);
  }

  ngOnInit(): void {

    let bSubject = this.rolesService.bSubject.subscribe(res => {
      this.getRolesData(this.roleId);
    })
    this.unsubscribe.push(bSubject);

  }

  getRolesData(roleId: string) {

    this.rolesService.rolesList.subscribe(res => {
      if (res) {
        this.roleData = res.roles.filter((x) => x.roleId == roleId)[0];
      }
    })
  }

  editRole(roleId: string) {
    this.rolesService.roleid.next(roleId);
    this.dialog.open(UpdateroleComponent, {
      height: '100vh',
      minWidth: '60vw',
      width: "60vw",
      position: { right: '0' }
    })
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
