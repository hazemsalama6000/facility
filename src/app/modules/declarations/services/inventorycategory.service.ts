import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IInventoryCatecory } from '../models/IInventoryCatecory.interface';

@Injectable({
  providedIn: 'root'
})
export class InventorycategoryService {


  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getInventoryCategory(companyId: Number): Observable<IInventoryCatecory[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_INVENTORY_CATEGORY}${companyId}`)
      .pipe(map((Items: any) => Items.data as IInventoryCatecory[]));
  }

  addInventoryCategory(model: any) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_INVENTORY_CATEGORY}`);
  }

  updateInventoryCategory(model:any) {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_INVENTORY_CATEGORY}${model.stockcategoryId}`);
  }

  deleteInventoryCategory(invCatId:number) {
    return this.http.CommonDeleteRequest( `${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_INVENTORY_CATEGORY}${invCatId}`);
  }

}
