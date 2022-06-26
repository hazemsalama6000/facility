import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Injectable({
	providedIn:'root'
})

export class EmployeeService 
{
    employees:LookUpModel[];
    bSubject = new BehaviorSubject(true); 

	constructor(private http:CommonHttpService){}
    
	getLookupEmployeeData(companyId:number):Observable<LookUpModel[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({Id:Item.id,Name:Item.name}) as LookUpModel )  ) );
	}

	DeleteLookupData(id:number):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_DELETE}${id}`);
	}
	
	PostLookupData(model:LookUpModel):Observable<any>{
      return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_ADD}`);
	}

	UpdateLookupData(model:LookUpModel):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_UPDATE}${model.Id}`);
	  }

	selectFromStore():Observable<any> {
		return this.bSubject.asObservable();
	 }


}