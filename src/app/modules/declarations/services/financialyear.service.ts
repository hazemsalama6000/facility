import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IFinancialYear } from '../models/IFinancialYear.interface';

@Injectable({
  providedIn: 'root'
})
export class FinancialyearService {

  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }

  GetFinancialYear(companyId: Number): Observable<IFinancialYear[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_FINANCIAL_YEAR}${companyId}`)
      .pipe(map((Items: any) => Items as IFinancialYear[]));

    // return of([
    //   { Id: 1, Year: '2015', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 2, Year: '2016', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 3, Year: '2017', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 4, Year: '2018', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 5, Year: '2019', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 6, Year: '2020', DateFrom: new Date(), DateTo: new Date(), IsActive: false },
    //   { Id: 7, Year: '2021', DateFrom: new Date(), DateTo: new Date(), IsActive: true },
    // ] as IFinancialYear[])
  }

  AddFinancialYear(model: IFinancialYear) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_FINANCIAL_YEAR}`);
  }

  StopIsActiveFinancialYear(companyId:number,financialYearId: number) {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEACTIVE_FINANCIAL_YEAR}CompanyId=${companyId}&FinancialYearId=${financialYearId}`);
  }

}
