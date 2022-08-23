import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Injectable({
	providedIn: 'root'
})

export class DepartmentService {

	emitDepartmentIdSubject = new BehaviorSubject<LookUpModel>({ Id: 0, company_Id: 0, Name: '' });

	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);

	constructor(private http: CommonHttpService) { }

	getLookupData(companyid:number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_GETALL}/${companyid}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name ,isActive:Item.isActive , isEdit:false,isAdd:false}) as LookUpModel)));
	}

	DeleteLookupData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_DELETE}${id}`);
	}

	PostLookupData(model: LookUpModel): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_ADD}`);
	}

	UpdateLookupData(model: LookUpModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_UPDATE}${model.Id}`);
	}

	toggleActiveDeactive(model: LookUpModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_UACTIVEDEACTIVE}${model.Id}`);
	}

	getDepartmentIdObservable(): Observable<any> {
		return this.emitDepartmentIdSubject.asObservable();
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}