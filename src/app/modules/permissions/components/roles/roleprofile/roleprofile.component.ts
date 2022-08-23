import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IRoles, IRolesProfile } from '../../../models/IRolesProfile.interface';
import { RolesService } from '../../../services/roles.service';

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
  url:string=localStorage.getItem("companyLink")??""


  constructor(
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private rolesService: RolesService
  ) {
    this.url = localStorage.getItem("companyLink") ?? '';
    let userDatasub = this.authService.userData.subscribe(res => {
      this.userData = res;
      let queryParams = this.activatedRoute.queryParams.subscribe((params) => {
        if (params.roleId) {
          this.roleId=params.roleId;
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
    this.rolesService.GetRolesDetailsForCompany(this.userData.companyId).subscribe(
      (res: IRolesProfile) => {
        this.roleData = res.roles.filter((x) => x.roleId == roleId)[0];
      },
      (err) => console.log(err),
      () => { }
    );

  }

  editRole(roleId: string) {
    this.rolesService.roleid.next(roleId);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
