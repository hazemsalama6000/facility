import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getVendor(searchModel: any): Observable<any[]> {
    return this.http.CommonPostRequests(searchModel,`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_VENDOR}`)
      .pipe(map((Items: any) => Items.data as any[]));
  }

  getLookUpVendor(companyId:number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_VENDOR}${companyId}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  getLookUpTaxOffice(): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_TAX_OFFICE}`)
      .pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  } 
  
  getLookUpBranch(companyId:number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_COMPANY_BRANCH}${companyId}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  addVendor(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_VENDOR}`);
  }

  updateVendor(model:any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_VENDOR}${model.id}`);
  }

  deleteVendor(VendorId:number) {
    return this.http.CommonDeleteRequest( `${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_VENDOR}${VendorId}`);
  }

}
