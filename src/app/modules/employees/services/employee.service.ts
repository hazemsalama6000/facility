import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IEmployee } from "../models/employee.interface";

@Injectable({
	providedIn: 'root'
})

export class EmployeeService {
	employees: LookUpModel[];
	bSubject = new BehaviorSubject(true);

	constructor(private http: CommonHttpService) { }

	getLookupEmployeeData(companyId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	getEmployeeById(employeeId: number): Observable<IEmployee> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEEBY_ID}?EmployeeId=${employeeId}`).pipe(
			map((data: HttpReponseModel) => data.data)
		);
	}

	toggleActive(employeeId: number) : Observable<HttpReponseModel>{
		return this.http.CommonPostRequests(null,`${localStorage.getItem("companyLink")}${HttpPaths.API_TOGGLE_EMPLOYEE_ACTIVE}?EmployeeId=${employeeId}`);
	}
	//

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}
	
	changeEmployeeImageData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CHANGE_EMP_IMAGE}`);
	}

}