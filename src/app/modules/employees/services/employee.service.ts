import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject, tap } from "rxjs";
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
	subjectEmployeeChanged = new BehaviorSubject(false);
	currentEmployeeSelected: IEmployee = {} as IEmployee;

	constructor(private http: CommonHttpService) { }

	getLookupEmployeeDataByParam(model?: any): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?
				BranchId=${model?.branchId == undefined ? '' : model?.branchId}&areaId=${model?.AreaId == undefined ? '' : model?.AreaId}&blockId=${model?.Block == undefined ? '' : model.Block}`)
			.pipe(
				tap(data => console.log(data)),
				map((Items:HttpReponseModel) => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
			);
	}

	getLookupEmployeeData(companyId: number,branchId?:number): Observable<LookUpModel[]> {
		let branchid:string=branchId!=undefined&&branchId!=null?('&BranchId='+branchId):'';
		 return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}${branchid}`)
		 	.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	// note
	getEmployeeById(employeeId: number): Observable<IEmployee> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEEBY_ID}?EmployeeId=${employeeId}`).pipe(
			map((data: HttpReponseModel) => data.data)
		);
	}

	toggleActive(employeeId: number): Observable<HttpReponseModel> {
		return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_TOGGLE_EMPLOYEE_ACTIVE}?EmployeeId=${employeeId}`);
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}

	changeEmployeeImageData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CHANGE_EMP_IMAGE}`);
	}


	DeleteLookupData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_DELETE}${id}`);
	}

	PostLookupData(model: LookUpModel): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_ADD}`);
	}

	UpdateLookupData(model: LookUpModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_UPDATE}${model.Id}`);
	}

	getEmployeesData(searchModel: any): Observable<any> {
		return this.http.CommonPostRequests(searchModel, `${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEES_DATA}`)
		// .pipe(map(Items => Items.map((Item: any) => ({ ...Item }))));

	}



}