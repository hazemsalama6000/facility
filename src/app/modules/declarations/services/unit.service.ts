import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { AuthService } from "../../auth";
import { IUnitData } from "../models/units/IUnitData.interface";

@Injectable({
	providedIn: 'root'
})

export class UnitsService {

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

	getLookupData(): Observable<IUnitData[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_UNITS_GETALL}?companyId=${this.companyId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name , unitType:Item.unitType , isActive: Item.isActive, isEdit: false, isAdd: false }) as IUnitData)));
	}

	getLookupUnitTypeData(): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_UNITTYPES}?companyId=${this.companyId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}


	DeleteLookupData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_UNITS_DELETE}${id}`);
	}

	PostLookupData(model: IUnitData): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNITS_ADD}`);
	}

	toggleActiveDeactive(model: LookUpModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_UNITS_UACTIVEDEACTIVE}${model.Id}`);
	}


	getStateIdObservable(): Observable<any> {
		return this.emitStateIdSubject.asObservable();
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}