import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
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

}
