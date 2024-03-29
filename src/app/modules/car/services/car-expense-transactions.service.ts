import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { ItemsWithPages } from "../components/carexpensetransactions/update-datatable/car-expense-transactions-datatable.component";
import { IExpenseCarSearch } from "../models/IExpenseCarSearch.interface";



@Injectable({ providedIn: 'root' })

export class CarExpenseTransactionService {

	searchUpdateUserManageAction: Subject<boolean> = new Subject<boolean>();
	searchUpdateUserManageStream$ = this.searchUpdateUserManageAction.asObservable();

	searchParameterAction: Subject<IExpenseCarSearch> = new Subject<IExpenseCarSearch>();
	searchParameterStream$ = this.searchParameterAction.asObservable();

	constructor(private http: CommonHttpService) { }

	PostExpenseTransactionData(model: any): Observable<any> {
		return this.http.CommonPostRequests([model], `${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CARS_EXPENSES_ADD}`);
	}

	getLookupCarExpenseTypesData(companyId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_EXPENSE_GETList}?companyId=${companyId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	
	DeleteCarTransactions(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_EXPENSETRANSACTION_DELETE}${id}`);
	}

	acceptCarTransactions(id: number): Observable<any> {
		return this.http.CommonPutRequests(null,`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_EXPENSES_ACCEPT}${id}`);
	}

	rejectCarTransactions(id: number): Observable<any> {
		return this.http.CommonPutRequests(null,`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_EXPENSES_REJECT}${id}`);
	}

	UploadImagesCarTransactions(model:any): Observable<any> {
		return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_EXPENSES_IMAGES}`);
	}

	searchCarTransactions(model: any) {

		let queryString = Object.keys(model).map((key: string) =>
		model[key] != null && model[key] != ''&& model[key] != 0 && model[key] != undefined ? key + '=' + model[key] : null
		).filter(x => x != null).join('&');

		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CARS_EXPENSES}${queryString}`)
			.pipe(map(Items => Items.data as ItemsWithPages));
	}


}