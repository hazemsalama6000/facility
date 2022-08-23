import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IRegion } from "../models/IRegion.interface";

@Injectable({
	providedIn:'root'
})

export class RegionService 
{

    regions:LookUpModel[];
    bSubject = new BehaviorSubject(true); 
	addFlag = new BehaviorSubject(false);

	constructor(private http:CommonHttpService){}
    
	getLookupData(regionId:number):Observable<IRegion[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_REGION_GETALL}?stateId=${regionId}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({id:Item.id , name:Item.name, isActive:Item.isActive , isEdit:false ,isAdd:false}) as IRegion )  ) );
	}

	DeleteLookupData(id:number):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_REGION_DELETE}${id}`);
	}
	
	PostLookupData(model:IRegion):Observable<any>{
      return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_REGION_ADD}`);
	}

	UpdateLookupData(model:IRegion):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_REGION_UPDATE}${model.id}`);
	}

	selectFromStore () : Observable<any> {
		return this.bSubject.asObservable();
	 }

	 toggleActiveDeactive(model: IRegion): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_REGION_UACTIVEDEACTIVE}${model.id}`);
	}

}