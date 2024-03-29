import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
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
  }

  GetActiveFinancialYear(companyId: Number): Observable<IFinancialYear[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ACTIVE_FINANCIAL_YEAR}${companyId}`)
      .pipe(map((Items: IFinancialYear) => [Items] as IFinancialYear[]));
  }

  getLookUpFinancialYear(companyId: Number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_FINANCIAL_YEAR}${companyId}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.year }) as LookUpModel)));
	}

  AddFinancialYear(model: IFinancialYear) {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_FINANCIAL_YEAR}`);
  }

  StopIsActiveFinancialYear(companyId:number,financialYearId: number) {
    return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEACTIVE_FINANCIAL_YEAR}CompanyId=${companyId}&FinancialYearId=${financialYearId}`);
  }

  checkFinancialYear(companyId:number,date:string){
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CHECK_FINANCIAL_YEAR}dataTime=${date}&CompanyId=${companyId}`);
  }

}
