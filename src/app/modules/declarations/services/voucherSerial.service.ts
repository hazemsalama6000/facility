import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { ItemsWithPages } from "../components/voucher-serials/voucher-serials-datatable/voucher-serials-datatable.component";
import { IVoucherSerialSearch } from "../models/voucher-serials/IVoucherSerialSearch.interface";



@Injectable({ providedIn: 'root' })

export class VoucherSerialService {

	searchUpdateUserManageAction: Subject<boolean> = new Subject<boolean>();
	searchUpdateUserManageStream$ = this.searchUpdateUserManageAction.asObservable();

	searchParameterAction: Subject<IVoucherSerialSearch> = new Subject<IVoucherSerialSearch>();
	searchParameterStream$ = this.searchParameterAction.asObservable();

	constructor(private http: CommonHttpService) { }

	PostVoucherSerialData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_VOUCHER_SERIAL_ADD}`);
	}

	getLookupBillsTypesData(): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_BILLS_TYPES}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	
	DeleteVoucherSerial(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_VOUCHER_SERIAL_DELETE}${id}`);
	}

	
	searchVoucherSerial(model: any) {
		
		let queryString = Object.keys(model).map((key: string) =>
		model[key] != null && model[key] != ''&& model[key] != 0 && model[key] != undefined ? key + '=' + model[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_VOUCHER_SERIAL_GETALL_SEARCH}?${queryString}`)
			.pipe(map(Items => Items.data as ItemsWithPages));
		
	}


}