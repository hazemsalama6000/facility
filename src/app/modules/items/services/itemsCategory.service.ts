import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IItem } from '../models/itemsCategory/IItem.interface';
import { IItemsCategory } from '../models/itemsCategory/IItemsCategory.interface';

@Injectable({
	providedIn: 'root'
})
export class ItemsCategoryService {
	bSubject = new BehaviorSubject<boolean>(false);

	constructor(private http: CommonHttpService) { }

	getItemsCategory(companyId: Number): Observable<IItemsCategory[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEMS_CATEGORY}${companyId}`)
			.pipe(map((Items: any) => Items.data as IItemsCategory[]));
	}




	getCategoryTypes(companyId: Number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CATEGORY_List}${companyId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getItemById(ItemId: Number): Observable<IItem> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ITEM_BY_ID}${ItemId}`)
			.pipe(map((Items: any) => Items.data as IItem));
	}

	Addcategory(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CATEGORY_ADD}`)
	}

	updateCategory(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CATEGORY_UPDATE}${model.id}`)
	}

	updateParentCategory(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_PARENT_CATEGORY_UPDATE}`)
	}

	toggleCategotyActiveDeactive(CategoryId: number): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_CATEGORY}${CategoryId}`)
	}

	AddItem(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ITEM_ADD}`)
	}

	updateItem(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_ITEM_UPDATE}${model.Id}`)
	}

	updateParentItem(model: any): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_PARENT_ITEM_UPDATE}`)
	}

	toggleItemsActiveDeactive(ItemId: number): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ACTIVE_DEACTIVE_ITEMS}${ItemId}`)
	}

}
