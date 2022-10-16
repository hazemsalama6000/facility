import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IAddTransaction } from '../models/IAddTransaction.interface';
import { IEntityType } from '../models/IEntityType.interface';
import { IInvTransactionPagination } from '../models/IInvTransaction.interface';
import { IReservedItem } from '../models/IReservedItem.interface';
import { ITransType } from '../models/ITransType.interface';
import { IUpdateReserved } from '../models/IUpdateReserved.interface';

@Injectable({
  providedIn: 'root'
})
export class InvTransactionService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  getTransaction(searchModel: any): Observable<IInvTransactionPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_TRANSACTION}${queryString}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IInvTransactionPagination));
  }

  getTransactionType(): Observable<ITransType[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_TRANSTYPE}`).pipe(
      map(Items => Items.data as ITransType[])
    );
  }

  getEntityType(TransTypeId: number): Observable<IEntityType[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_ENTITYTYPE}?stockTransTypeId=${TransTypeId}`).pipe(
      map(Items => Items.data as IEntityType[])
    );
  }

  getExternalPlaces(companyId: number) {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_EXTERNAL_PLACES}${companyId}`).pipe(
      map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
    );
  }

  getDocumentNumber(financialYearId: number, stockId: number, stockTransactionTypeId: number) {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_DOCUMENT_NUMBER}FinancialYearId=${financialYearId}&StockId=${stockId}&StockTransactionTypeId=${stockTransactionTypeId}`)
  }

  addTransaction(model: IAddTransaction): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem('companyLink')}${HttpPaths.API_ADD_TRANSACTION}`)
  }

  getItemTransactions(itemId: number, stockId: number) {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_ITEM_TRANSACTION}itemId=${itemId}&stockId=${stockId}`).pipe(
      map(items => items.data as IReservedItem[])
    )
  }

  updateReserved(model: IUpdateReserved[]): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem('companyLink')}${HttpPaths.API_UPDATE_RESERVED}`)
  }

  getTransferFromTransaction(searchModel: any): Observable<IInvTransactionPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_TRANSFER_TRANSACTION}${queryString}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IInvTransactionPagination));
  }

  getPrice(requiredQuantity: number, itemId: number, stockId: number):Observable<HttpReponseModel> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_PRICE}requiredQuantity=${requiredQuantity}&itemId=${itemId}&stockId=${stockId}`).pipe(map(items => items as HttpReponseModel));
  }

}
