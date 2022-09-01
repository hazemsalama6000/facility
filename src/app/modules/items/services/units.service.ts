import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";



@Injectable({providedIn:'root'})

export class UnitService{

	constructor(private http: CommonHttpService) { }

	getLookUpItemsRelatedUnits(itemId:Number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_UNITS_RELATEDTO_ITEM_CRITERIA}?itemDataId=${itemId}`)
		  .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	  }
	
	  
	getItemsBaseUnit(itemId:Number): Observable<string> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_MAIN_UNITS}?itemDataId=${itemId}`)
		  .pipe(map(Items => Items.data));
	  }
}