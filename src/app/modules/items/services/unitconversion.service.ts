import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { AuthService } from "../../auth";
import { IUnitConverionResponse } from "../models/unit-converion/IUnitConverionResponse.interface";

@Injectable({
	providedIn: 'root'
})

export class UnitConversionService {

	states: LookUpModel[];

	emitStateIdSubject = new BehaviorSubject<LookUpModel>({ Id: 0, company_Id: 0, Name: '' });

	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
	companyId: number;

	constructor(private http: CommonHttpService, private auth: AuthService) {
		this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
	}

	getLookupData(): Observable<IUnitConverionResponse[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_UNIT_CONVERSION_GETALL}?companyId=${this.companyId}`)
			.pipe(map(Items => Items.data));
	}

	DeleteLookupData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_UNIT_CONVERSION_DELETE}${id}`);
	}

	PostLookupData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNIT_CONVERSION_ADD}`);
	}

	toggleActiveDeactive(element:any): Observable<any> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNIT_CONVERSION_UACTIVEDEACTIVE}${element.id}`);
	}


	getStateIdObservable(): Observable<any> {
		return this.emitStateIdSubject.asObservable();
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}