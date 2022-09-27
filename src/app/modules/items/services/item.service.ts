import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";



@Injectable({ providedIn: 'root' })

export class ItemService {

	constructor(private http: CommonHttpService) { }

	getLookUpItems(company_Id: Number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEMS_LOOKUP}${company_Id}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getLookUpItemsByCode(company_Id: Number,CodeOrName:string): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_ITEMS}CompanyId=${company_Id}&SearchingChar=${CodeOrName}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

}