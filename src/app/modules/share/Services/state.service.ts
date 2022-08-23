import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Injectable({
	providedIn:'root'
})

export class StatesService 
{

	states:LookUpModel[];

	emitStateIdSubject = new BehaviorSubject<LookUpModel>({Id:0,company_Id:0,Name:''});
    
    bSubject = new BehaviorSubject(true); 
	addFlag = new BehaviorSubject(false);

	constructor(private http:CommonHttpService){}
    
	getLookupData():Observable<LookUpModel[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_STATE_GETALL}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({Id:Item.id,Name:Item.name,isActive:Item.isActive , isEdit:false , isAdd:false}) as LookUpModel )  ) );
	}

	DeleteLookupData(id:number):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_STATE_DELETE}${id}`);
	}
	
	PostLookupData(model:LookUpModel):Observable<any>{
      return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_STATE_ADD}`);
	}

	UpdateLookupData(model:LookUpModel):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_STATE_UPDATE}${model.Id}`);
	  }

	  toggleActiveDeactive(model: LookUpModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_STATE_UACTIVEDEACTIVE}${model.Id}`);
	}


    getStateIdObservable ():Observable<any>{
		return this.emitStateIdSubject.asObservable();
	}

	selectFromStore () : Observable<any> {
		return this.bSubject.asObservable();
	 }


}