import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';

@Injectable({
  providedIn: 'root'
})
export class ReceivedataService {

  constructor(private http: CommonHttpService) { }

  syncGeographicData(): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_PULL_GEOGRAPHIC_DATA}`)
  }

  syncEmployeeData(): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_PULL_EMPLOYEE_DATA}`)
  }

  syncCustomerData(): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_PULL_CUSTOMER_DATA}`)
  }

  syncIssueData(): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_PULL_ISSUES_DATA}`)
  }

}
