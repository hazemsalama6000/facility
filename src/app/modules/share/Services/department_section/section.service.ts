import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { ISection } from "../../models/ISection.interface";

@Injectable({
	providedIn:'root'
})

export class SectionService 
{

    
    bSubject = new BehaviorSubject(true); 
	
	addFlag = new BehaviorSubject(false);

	constructor(private http:CommonHttpService){}
    
	getLookupData(departmentId:number):Observable<ISection[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_SECTION_GETALL}${departmentId}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({id:Item.id , name:Item.name,isActive:Item.isActive , isEdit:false ,isAdd:false }) as ISection )  ) );
	}


	toggleActiveDeactive(model: ISection): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_DEPARTMENT_UACTIVEDEACTIVE}${model.id}`);
	}


	DeleteLookupData(id:number):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_SECTION_DELETE}${id}`);
	}
	
	PostLookupData(model:ISection):Observable<any>{
      return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_SECTION_ADD}`);
	}

	UpdateLookupData(model:ISection):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_SECTION_UPDATE}${model.id}`);
	}

	selectFromStore () : Observable<any> {
		return this.bSubject.asObservable();
	 }


}