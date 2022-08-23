import { Injectable } from "@angular/core";
import { BehaviorSubject, map, of, Subject } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { ItemsWithPages } from "../components/customer-update-manage/update-datatable/update-datatable.component";
import { ICustomerEditManageSearch } from "../models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { ICustomerEditResponse } from "../models/cutomer-editmanage/ICustomerEditResponse.interface";



@Injectable({ providedIn: 'root' })

export class customerUpdateManageService {

	searchUpdateUserManageAction: Subject<boolean> = new Subject<boolean>();
	searchUpdateUserManageStream$ = this.searchUpdateUserManageAction.asObservable();

	searchParameterAction: Subject<ICustomerEditManageSearch> = new Subject<ICustomerEditManageSearch>();
	searchParameterStream$ = this.searchParameterAction.asObservable();

	constructor(private http: CommonHttpService) { }


	searchCustomerUpdate(model: any) {
		
		let queryString = Object.keys(model).map((key: string) =>
		model[key] != null && model[key] != ''&& model[key] != 0 && model[key] != undefined ? key + '=' + model[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CUSTOMERDATA}${queryString}`)
			.pipe(map(Items => Items.data as ItemsWithPages));
		
	}


}