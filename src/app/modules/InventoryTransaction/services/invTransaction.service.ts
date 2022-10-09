import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IEntityType } from '../models/IEntityType.interface';
import { IInvTransactionPagination } from '../models/IInvTransaction.interface';

@Injectable({
  providedIn: 'root'
})
export class InvTransactionService {

  constructor(private http: CommonHttpService) { }

  getTransaction(searchModel: any): Observable<IInvTransactionPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_TRANSACTION}${queryString}`)
      .pipe(map((Items: HttpReponseModel) => Items.data as IInvTransactionPagination));
  }

  getTransactionType() {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_TRANSTYPE}`).pipe(
      map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
    );
  }

  getEntityType(): Observable<IEntityType[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_ENTITYTYPE}`).pipe(
      map(Items => Items.data as IEntityType[])
    );
  }

  getExternalPlaces(companyId: number) {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_EXTERNAL_PLACES}${companyId}`).pipe(
      map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
    );
  }

}
