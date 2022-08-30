import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { ItemsWithPages } from "../components/carexpensetransactions/update-datatable/car-expense-transactions-datatable.component";
import { IExpenseCarSearch } from "../models/IExpenseCarSearch.interface";



@Injectable({ providedIn: 'root' })

export class CarService {


	constructor(private http: CommonHttpService) { }


	getLookupCarData(branchId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CARS_DROPDOWNS}?branchId=${branchId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}



}