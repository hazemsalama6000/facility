import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { IItemProfile } from "../models/itemsCategory/IItemProfile.interface";



@Injectable({ providedIn: 'root' })

export class ItemService {

	constructor(private http: CommonHttpService) { }

	getLookUpItems(company_Id: Number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEMS_LOOKUP}${company_Id}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getLookUpItemsByCode(company_Id: Number, CodeOrName: string): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_ITEMS}CompanyId=${company_Id}&SearchingChar=${CodeOrName}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getItemProfile(itemId: number,stock_Id:number, companyId: number):Observable<IItemProfile> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEM_PROFILE}itemId=${itemId}&companyId=${companyId}&stockId=${stock_Id} `).pipe(
			map((Items) => Items.data as IItemProfile)
		);
	}

	getItemProfileForOrder(itemId: number, companyId: number):Observable<IItemProfile> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEM_BY_ID_FOR_ORDER}itemId=${itemId}&companyId=${companyId}`).pipe(
			map((Items) => Items.data as IItemProfile)
		);
	}

}