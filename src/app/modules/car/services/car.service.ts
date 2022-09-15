import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { Icar, IcarPagination } from '../models/ICar.interface';
import { ICarLogs } from '../models/ICarLogs.interface';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  bSubject = new BehaviorSubject<boolean>(false);
  carModel = new BehaviorSubject<Icar>({id:0});

  constructor(private http: CommonHttpService) { }

  getCars(searchModel: any): Observable<IcarPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CARS}${queryString}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IcarPagination));
  }

  addCar(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_CAR}`);
  }  
  
  updateCar(model: any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_CAR}${model.id}`);
  }

  AssignCarToTechincian(model:FormData) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ASSIGN_CAR_TO_TECHNICAIN}`);
  }

  UnAssignCarToTechincian(model:FormData) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNASSIGN_CAR_TO_TECHNICAIN}`);
  } 
  
  AssignCarToDriver(model:FormData) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ASSIGN_CAR_TO_DRIVER}`);
  }

  UnAssignCarToDriver(model:FormData) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNASSIGN_CAR_TO_DRIVER}`);
  }

  getLookUpCarModel(company_Id:Number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_CAR_MODEL}${company_Id}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }


  getLookUpDriver(company_Id:Number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_DRIVER}companyId=${company_Id}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  getHistoryCar(carId: number): Observable<ICarLogs> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_OF_CAR_LOGS}carId=${carId}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as ICarLogs));
  }


}
