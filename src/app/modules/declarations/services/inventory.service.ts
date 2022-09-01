import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IInventory } from '../models/IInventory.interface';
import { IStockTechnique } from '../models/IStockTechnique.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getInventory(companyBranchId: number): Observable<IInventory[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_INVENTORY}${companyBranchId}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IInventory[]));
  }

  addInventory(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_INVENTORY}`);
  }

  deleteInventory(StockId: number) {
    return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_INVENTORY}${StockId}`);
  }

  toggelIsActiveInventory(StockId: number) {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVEDEACTIVE_INVENTORY}${StockId}`);
  }

  AssignTechnicianToInventory(StockId: number, EmployeeId: number) {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ASSIGN_EMPLOYEE_TO_INVENTORY}StockId=${StockId}&EmployeeId=${EmployeeId}`);
  } 
  
  GetInventoryTechnicianLogs(StockId: number) {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_STOCK_TECHNIQUE}${StockId}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as any[]));
  }

  //stock 
  getLookUpStockTechnique(): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_STOCK_TECHNIQUE}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

  getStockTechniqueLogs(StockId: number): Observable<IStockTechnique[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_STOCK_TECHNIQUE}${StockId}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IStockTechnique[]));
  }

  AddStockTechnique(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_STOCK_TECHNIQUE}`);
  }

  stopStockTechnique(model: any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEACTIVE_STOCK_TECHNIQUE}`);
  }

}
