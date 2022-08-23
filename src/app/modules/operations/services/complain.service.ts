import { Injectable } from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IComplainDisplay } from '../../customers/models/IComplain.interface';
import { IComplain, IComplainList } from '../models/IComplain.interface';
import { IUpdateComplain } from '../models/IUpdateComplain.interface';

@Injectable({
	providedIn: 'root'
})
export class ComplainService {

	searchUpdateAction: Subject<boolean> = new Subject<boolean>();
	searchUpdate$ = this.searchUpdateAction.asObservable();

	constructor(private http: CommonHttpService) { }
	getComplainsData(searchModel: any): Observable<IComplain> {
		let queryString = Object.keys(searchModel).map((key: string) =>
			searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPLAINTS}${queryString}`)
			.pipe(map(Items => Items.data as IComplain));
	}

	getComplainsByCustomerId(customerId: number , pageNumber:number,PageSize:number) {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPLAINTS_BY_CUSTOMERID}CustomerId=${customerId}&PageNumber=${pageNumber}&PageSize=${PageSize}`)
			.pipe(map((Items: HttpReponseModel) => Items.data as IComplain));
	}
	getComplainsByEmployeeId(employeeId: number , pageNumber:number,PageSize:number) {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPLAINTS_BY_CUSTOMERID}Employee_id=${employeeId}&PageNumber=${pageNumber}&PageSize=${PageSize}`)
			.pipe(map((Items: HttpReponseModel) => Items.data as IComplain));
	}
	getLookupCustomerData(search: any): Observable<LookUpModel[]> {
		// this.http.CommonPostRequests(search, `${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEES_DATA}`)
		// 	.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
		return of([{ Id: 1, Name: 'Zomm' } as LookUpModel, { Id: 1, Name: 'Ahmed' } as LookUpModel]);
	}

	PostIsrevise(complain: IUpdateComplain[]): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(complain, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDATE_COMPLAINTS}`);
	}

}
