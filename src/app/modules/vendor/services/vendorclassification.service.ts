import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IVendorClassification } from '../models/IVenndorClassification.interface';

@Injectable({
  providedIn: 'root'
})
export class VendorclassificationService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getClassification(companyBranchId:number): Observable<IVendorClassification[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CLASSIFICATION}${companyBranchId}`)
      .pipe(map((Items: any) => Items.data as IVendorClassification[]));
  }

  getLookUpClassification(companyId:number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_CLASSIFICATION}${companyId}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  addClassification(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_CLASSIFICATION}`);
  }

  updateClassification(model:any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_CLASSIFICATION}${model.Id}`);
  }

  deleteClassification(ClassificationId:number) {
    return this.http.CommonDeleteRequest( `${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_CLASSIFICATION}${ClassificationId}`);
  }

  toggleActiveDeactive(Id: number): Observable<HttpReponseModel> {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_VENDOR_CLASSIFICATION}${Id}`)
  }
  
}
