import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tab } from "bootstrap";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { environment } from "src/environments/environment";
import { LookUpModel } from "../models/lookup";

@Injectable({
	providedIn: 'root'
})

export class LookupService {
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);

	constructor(private http: CommonHttpService) { }

	getLookupData(companyId: number,pagename: string ): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths[(`API_${pagename}_GETALL`) as keyof typeof HttpPaths]}${companyId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name, isActive: Item.isActive, isEdit: false, isAdd: false }) as LookUpModel)));
	}

	DeleteLookupData(id: number,pagename: string): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths[(`API_${pagename}_DELETE`) as keyof typeof HttpPaths]}${id}`);
	}

	PostLookupData(model: LookUpModel,pagename: string): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths[(`API_${pagename}_ADD`) as keyof typeof HttpPaths]}`);
	}

	UpdateLookupData(model: LookUpModel,pagename: string): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths[(`API_${pagename}_UPDATE`) as keyof typeof HttpPaths]}${model.Id}`);
	}

	toggleActiveDeactive(model: LookUpModel,pagename: string): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths[(`API_${pagename}_UACTIVEDEACTIVE`) as keyof typeof HttpPaths]}${model.Id}`);
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}