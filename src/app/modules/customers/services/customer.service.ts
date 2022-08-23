import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ICustomerEditManageSearch } from "../../operations/models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { ICustomer } from "../models/customer.interface";
import { ISeachListOfCustomer } from "../models/ISeachListOfCustomer.interface";
import { ISearch } from "../models/ISearch.interface";

@Injectable({
	providedIn: 'root'
})

export class CutomerService {
	employees: LookUpModel[];
	bSubject = new BehaviorSubject(true);
	currentEmployeeSelected: ICustomer = {} as ICustomer;

	constructor(private http: CommonHttpService) { }

	getLookupCustomerDataByParam(model: ISeachListOfCustomer): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_LISTOFCUSTOMER}
		areaId=${model.AreaId == undefined ? '' : model.AreaId}
		&BlockId=${model.Block == undefined ? '' : model.Block}
		&branchId=${model.branchId == undefined ? '' : model.branchId}
		&employeeId=${model.employeeId == undefined ? '' : model.employeeId}`)
		.pipe(map((Items:HttpReponseModel) => Items.data?.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getLookupCutomerDataByEmployee(employeeId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CUSTOMER_BY_EMPID}${employeeId}`)
			.pipe(map((Items:HttpReponseModel) => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getLookupCutomerData(companyId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getCutomerById(customerId: number): Observable<ICustomer> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CUSTOMERBY_ID}CustomerId=${customerId}`).pipe(
			map((data: HttpReponseModel) => data.data as ICustomer)
		);
	}

	getCutomerByCode(code: string): Observable<ICustomer> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CUSTOMERBY_CODE}CustomerCode=${code}`).pipe(
			map((data: HttpReponseModel) => data.data as ICustomer)
		);
	}

	toggleActive(customerId: number): Observable<HttpReponseModel> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_CUSTOMER_ISCOMPLETE}${customerId}`);
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}