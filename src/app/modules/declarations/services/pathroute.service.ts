import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IPathRoute, IPathRoutePaginantion } from '../models/IPathRoute.interface';
import { IPathRouteSearch } from '../models/IPathRouteSearch.interface';

@Injectable({
  providedIn: 'root'
})
export class PathrouteService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getLookUpPathRoute(): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_PATH_ROUTE}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  getPathRoute(searchModel: any): Observable<IPathRoutePaginantion> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_PATH_ROUTE}${queryString}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IPathRoutePaginantion));
  }

  addPathRoute(model: IPathRoute) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_PATH_ROUTE}`);
  }

  toggelIsActivePathRoute(pathRouteId: number) {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_PATH_ROUTE}${pathRouteId}`);
  }  
  
  UnAssignTechincianToPathRoute(pathRouteId: number) {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths}${pathRouteId}`);
  }

  AssignPathRouteToTechnician(PathRoute_Id: number, Technicial_Id: number) {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_PATH_ROUTE}`);
  }

  UnAssignPathRoute(pathRoute_Id: number) {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_PATH_ROUTE}${pathRoute_Id}`);
  }



}
