import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tab } from "bootstrap";
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from "rxjs";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { environment } from "src/environments/environment";
import { IDailyStatics } from "../models/IDailyStatics.interface";
import { IDisplayDailyStaticsPerEmp } from "../models/IDisplayDailyStaticsPerEmp.interface";
import { IIssueDisplayStatics } from "../models/IIssueDisplayStatics.interface";
import { ISearchModel } from "../models/ISearchModel.interface";
import { IEmployeeStatics } from "../tables/tables-widget10/tables-widget10.component";

@Injectable({
	providedIn: 'root'
})

export class StaticsService {
	searchUpdateAction: Subject<boolean> = new Subject<boolean>();
	searchUpdate$ = this.searchUpdateAction.asObservable();

	constructor(private http: CommonHttpService) { }

	getEmployeesStatic(model: any): Observable<IEmployeeStatics> {
		let queryString = Object.keys(model).map((key: string) =>
			model[key] != null && model[key] != '' && model[key] != undefined ? key + '=' + model[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEE_STATICS}?${queryString}`).pipe(
			map((data: HttpReponseModel) => data.data)
		);
	}

	getIssuesTweleveStatic(companyId: any): Observable<IIssueDisplayStatics[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_TWELVE_ISSUES_STATICS}${companyId}`).pipe(
			map((data: HttpReponseModel) => data.data)
		);
	}


	getDailyStatic(model: any): Observable<IDailyStatics[]> {
		let queryString = Object.keys(model).map((key: string) =>
			model[key] != null && model[key] != '' && model[key] != undefined ? key + '=' + model[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_DAILY_STATICS}?${queryString}`).pipe(map((data:HttpReponseModel)=> data.data));
	}

}