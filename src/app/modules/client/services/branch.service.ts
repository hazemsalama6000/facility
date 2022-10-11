import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { IBranch } from "../models/IBranch";
import { IBranchUpsert } from "../models/IBranchUpsert.interface";

@Injectable({
	providedIn:'root'
})

export class ClientBranchService 
{

    
    bSubject = new BehaviorSubject(true); 

	constructor(private http:CommonHttpService){}
    
	getBranchData(companyId:number):Observable<IBranch[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_GETBRANCHES}clientDataId=${companyId}`)
			.pipe( map(Items=> Items.data ));
	}

	getBranchDataById(id:number): Observable<IBranchUpsert> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_GETBYID}${id}`);
	}


	toggleActiveDeactive(model: IBranch): Observable<any> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCH_TOGGLE}${model.id}`);
	}

	toggleSalesActiveDeactive(model: IBranch): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_SALESPERSONLOCKUNLOCK}${model.id}`);
	}


	PostBranchData(model:IBranchUpsert):Observable<any>{
      return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_ADD}`);
	}

	UpdateBranchData(model:IBranchUpsert):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_UPDATE}${model.id}`);
	}

	selectFromStore () : Observable<any> {
		return this.bSubject.asObservable();
	 }


}