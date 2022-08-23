import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IUsers } from '../models/IRolesProfile.interface';
import { IUserList } from '../models/IUserLList.interface';
import { IUserRole } from '../models/IUserRole.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  bSubject = new BehaviorSubject<boolean>(false);
  userid = new BehaviorSubject<string>('');

  constructor(private http: CommonHttpService) { }

  //Get Users By CompanyID
  GetCompanyUsers(companyId: number, search: string=''): Observable<IUsers[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPANY_USERS}${companyId}${search}`)
      .pipe(map((Items: any) => Items.data as IUsers[]));
  }

  //Add New User
  PostUserData(model: any): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_USER_REGISTER}`);
  }

  //Get User Type
  getUserTypeData(): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_USER_TYPE}`)
      .pipe(map((Items: any) => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  //Get Roles By CompanyID
  getRolesByCompanyData(companyId: number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPANY_ROLES}${companyId}`)
      .pipe(map((Items: any) => Items.data ));
  }

  //Get Roles By UserID
  getRolesByUserData(userID: string): Observable<any> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_USER_ROLES}${userID}`)
    .pipe(map((Items: any) => Items.data as IUserRole));
  }

  //Update User Roles
  putUserRoles(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_USER_ROLES}`);
  }

  resetPassword(UserId: string) {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_RESET_USER_PASSWORD}${UserId}`);
  }

  activeOrNot(UserId: string) {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_USER_OR_NOT}${UserId}`);
  }

}
