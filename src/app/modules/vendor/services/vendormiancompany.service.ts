import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IVendorMainCompany } from '../models/IVendorMainCompany.interface';

@Injectable({
  providedIn: 'root'
})
export class VendormiancompanyService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getMainCompany(companyBranchId:number): Observable<IVendorMainCompany[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_MAIN_COMPANY}${companyBranchId}`)
      .pipe(map((Items: any) => Items.data as IVendorMainCompany[]));
  }

  getLookUpMainCompany(companyId:number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_MAIN_COMPANY}${companyId}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  addMainCompany(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_MAIN_COMPANY}`);
  }

  updateMainCompany(model:any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_MAIN_COMPANY}${model.Id}`);
  }

  deleteMainCompany(MainCompanyId:number) {
    return this.http.CommonDeleteRequest( `${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_MAIN_COMPANY}${MainCompanyId}`);
  }

}
