import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject, tap } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IEmployee } from "../models/employee.interface";
import { IEmployeeForm } from "../models/IEmployeeForm.interface";

@Injectable({
	providedIn: 'root'
})

export class EmployeeService {
	employees: LookUpModel[];
	bSubject = new BehaviorSubject(true);
	bSubjectStream = this.bSubject.asObservable();
	subjectEmployeeChanged = new BehaviorSubject(false);
	currentEmployeeSelected: IEmployee = {} as IEmployee;



	constructor(private http: CommonHttpService) { }

	getLookupEmployeeDataByParam(model?: any): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?
				BranchId=${model?.branchId == undefined ? '' : model?.branchId}&areaId=${model?.AreaId == undefined ? '' : model?.AreaId}&blockId=${model?.Block == undefined ? '' : model.Block}`)
			.pipe(
				tap(data => console.log(data)),
				map((Items: HttpReponseModel) => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
			);
	}

	/*getLookupEmployeeDataForCustomerEditMange(model: ICustomerEditManageSearch): Observable<LookUpModel[]> {
				return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}`)
					.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
		//return of([{ Id: 1, Name: 'Zomm' } as LookUpModel, { Id: 1, Name: 'Ahmed' } as LookUpModel]);
	}
*/
	getLookupEmployeeData(companyId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEELOOKUP}?companyId=${companyId}`)
			.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	// note
	getEmployeeById(employeeId: number): Observable<IEmployee> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEEBY_ID}?employeeId=${employeeId}`).pipe(
			map((data: HttpReponseModel) => data.data)
		);
	}

	getEmployeeByIdForUpdate(employeeId: number): Observable<IEmployeeForm> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEEBY_UPDATE_ID}?employeeId=${employeeId}`).pipe(
			map((data: HttpReponseModel) => {
				return {
					Address: data.data.address, BirthDate: data.data.birthDate
					, Branch_Id: data.data.branch_Id, Code: data.data.code, Department_Id: data.data.department_Id, Email: data.data.email, GraduateDate: data.data.graduateDate
					, HireDate: data.data.hireDate, id: data.data.id, IsTechnician: data.data.isTechnician, JobSection_Id: data.data.jobSection_Id, MartialStatus_Id: data.data.martialStatus_Id,
					MilitaryStatus_Id: data.data.militaryStatus_Id, Mobile: data.data.mobile, Name: data.data.name, NId: data.data.nId
					, Qualification: data.data.qualification, Region_Id: data.data.region_Id,Status_Id:data.data.status_Id, Section_Id: data.data.section_Id, state_Id: data.data.state_Id, University: data.data.university
				} as IEmployeeForm;
			})
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

	PostEmployeeData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_POST_ADD_EMPLOYEE}`);
	}

	UpdateLookupData(model: IEmployeeForm): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_POST_UPDATE_EMPLOYEE}${model.id}`);
	}

	getEmployeesData(searchModel: any): Observable<any> {
		return this.http.CommonPostRequests(searchModel, `${localStorage.getItem("companyLink")}${HttpPaths.API_GET_EMPLOYEES_DATA}`)
		// .pipe(map(Items => Items.map((Item: any) => ({ ...Item }))));

	}







	



	


}