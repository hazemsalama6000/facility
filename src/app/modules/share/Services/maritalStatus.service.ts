import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Injectable({
	providedIn:'root'
})

export class MaritalStatusService
{

	militaryStatusList:LookUpModel[];

	constructor(private http:CommonHttpService){}
    
	getLookupData():Observable<LookUpModel[]>{
            return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_MARITALSTATUS_GETLIST}`)
			.pipe( map(Items=> Items.map( (Item:any) => ({Id:Item.id,Name:Item.name}) as LookUpModel )  ) );
	}

}