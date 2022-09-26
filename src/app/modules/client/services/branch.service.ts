import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { IBranch } from "../models/IBranch";
import { IBranchUpsert } from "../models/IBranchUpsert.interface";

@Injectable({
	providedIn:'root'
})

export class BranchService 
{

    
    bSubject = new BehaviorSubject(true); 

	constructor(private http:CommonHttpService){}
    
	getBranchData(companyId:number):Observable<IBranch[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_GETALL}${companyId}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({id:Item.id , branchName:Item.branchName , branchAddress:Item.branchAddress , isActive:Item.isActive ,lockTechnicalsLogins:Item.lockTechnicalsLogins}) as IBranch )  ) );
	}

	getBranchDataById(id:number): Observable<IBranchUpsert> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_GETBYID}${id}`);
	}


	toggleActiveDeactive(model: IBranch): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_ACTIVEORNOT}${model.id}`);
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