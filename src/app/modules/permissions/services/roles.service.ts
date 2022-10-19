import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IAddRole } from '../models/IAddRole.interface';
import { ICompanyRoles } from '../models/ICompanyRoles.interface';
import { IManagePermission } from '../models/IManagePermission.interface';
import { IRolesProfile } from '../models/IRolesProfile.interface';
import { ITreeRoles } from '../models/ITreeRoles.interface';
import { IUpdateRole } from '../models/IUpdateRole.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  bSubject = new BehaviorSubject<boolean>(false);
  roleid = new BehaviorSubject<string>('');
  permissionTree = new BehaviorSubject<ITreeRoles[]>([]);
  rolesList = new BehaviorSubject<IRolesProfile>({} as IRolesProfile);
  
  constructor(private http: CommonHttpService) { }
  //this function to get role with claims and users
  GetRolesDetailsForCompany(companyId: number): Observable<IRolesProfile> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ROLES_DETAILS_FOR_COMPANY}${companyId}`)
      .pipe(map((Items: any) => Items.data as IRolesProfile));
  }

  //Start Functions for Add Role 
  GetDefaultPermissionForCompany(companyId: number): Observable<ITreeRoles[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_DEFAULT_PERMISSIONS_FOR_COMPANY}${companyId}`)
      .pipe(map((Items: any) => Items.data as ITreeRoles[]));
  }

  AddRole(model: IAddRole): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_ROLE}`);
  }
  //End Functions for Add Role

  //Start Functions for Update Role 
  GetPermissionByRole(RoleId: string): Observable<IManagePermission> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_PERMISSIONS_BY_ROLE}${RoleId}`)
      .pipe(map((Items: any) => Items.data as IManagePermission));
  }

  UpdateRole(model: IUpdateRole): Observable<any> {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_ROLE}${model.roleId}`);
  }
  //End Functions for Update Role

  //this function to delete role
  DeleteRole(roleId: string): Observable<any> {
    return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_ROLE}${roleId}`)
  }

  //this function to add or update permissions for role
  PostManagePermission(model: IManagePermission): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_MANAGE_PERMISSION_FOR_ROLE}`);
  }

  GetCompanyRole(CompanyId: number): Observable<ICompanyRoles> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPAY_ROLES}${CompanyId}`)
      .pipe(map((Items: any) => Items.data as ICompanyRoles));
  }

  AddCompanyRole(model: ICompanyRoles): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_COMPANY_ROLES}`);
  }

}
