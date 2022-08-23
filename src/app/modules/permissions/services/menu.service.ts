import { Injectable } from '@angular/core';
import { Observable, map, of, BehaviorSubject } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { ITreeMenu } from '../models/ITreeMenu.interface';
import { ITreeRoles } from '../models/ITreeRoles.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuTree = new BehaviorSubject<ITreeMenu[]>([]);
  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  GetMenu(): Observable<ITreeMenu[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ALL_MENU}`)
      .pipe(map((Items: any) => Items.data as ITreeMenu[]));
  }


  GetPermission(): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_PERMISSIONS_MENU}`)
      .pipe(map((Items: any) => Items.data.map((Item: any) => ({ Name: Item }) as LookUpModel)));
  }

  AddMenu(model: ITreeMenu): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_MENU}`);
  }

  UpdateMenu(model: ITreeMenu): Observable<any> {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_MENU}`);
  }

  DeleteMenu(nodeId: number): Observable<any> {
    return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_MENU}${nodeId}`)
  }

  toggleItemsActiveDeactive(ids:number[]): Observable<any>{
    return this.http.CommonPutRequests(ids, `${localStorage.getItem("companyLink")}${HttpPaths.API_ActiveDeactive_MENU}`);
  }

}
