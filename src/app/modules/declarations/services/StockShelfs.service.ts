import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { ITreeStockShelfs } from '../models/ITreeStockShelfs.interface';

@Injectable({
  providedIn: 'root'
})
export class StockShelfsService {
  stockShelfTree = new BehaviorSubject<ITreeStockShelfs[]>([]);
  bSubject = new BehaviorSubject<boolean>(false);
  StockId = new BehaviorSubject<number>(9);


  constructor(private http: CommonHttpService) { }

  getStockShelfsByStockId(stock_Id: number): Observable<ITreeStockShelfs[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_STOCK_SHELFS}${stock_Id}`)
      .pipe(map((Items: any) => Items.data as ITreeStockShelfs[]));
  }

  addStockShelf(model: any): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_STOCK_SHELFS}`)
  }

  updateStockShelf(model: any): Observable<HttpReponseModel> {
    console.log(model)
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_STOCK_SHELFS}${model.stockShelfId}`)
  }

  updateParentShelf(model: any): Observable<HttpReponseModel> {
    return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_PARENT_STOCK_SHELFS}${model.stockShelfId}`)
  }

  toggleItemsActiveDeactive(nodeId: number): Observable<HttpReponseModel> {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_STOCK_SHELFS}${nodeId}`)
  }


}
