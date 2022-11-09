import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IAddOrder } from '../models/IAddOrder.interface';
import { IOrderPagination } from '../models/IOrdersList.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderingService {
  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getOrders(searchModel:any): Observable<IOrderPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
    searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
  ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_ORDERS}${queryString}`)
    .pipe(map((Items:HttpReponseModel) => Items.data as IOrderPagination));
  }

  getStatisticsOrders(searchModel:any): Observable<IOrderPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
    searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
  ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_STATISTICS_ORDERS}${queryString}`)
    .pipe(map((Items:HttpReponseModel) => Items.data as IOrderPagination));
  }

  addOrder(model: IAddOrder[]): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem('companyLink')}${HttpPaths.API_ADD_ORDER}`)
  }

}
