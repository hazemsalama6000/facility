import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IBranch } from "../models/IBranch";
import { IBranchPathRoutesLogs } from "../models/IBranchPathRoutesLogs.interface";
import { IBranchAddModel } from "../models/IBranchUpsert.interface";
import { IclientBranchAssignPathModel } from "../models/IclientBranchAssignPathModel.interface";

@Injectable({
	providedIn: 'root'
})

export class ClientBranchService {


	bSubject = new BehaviorSubject(true);

	constructor(private http: CommonHttpService) { }

	getBranchData(companyId: number): Observable<IBranch[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_GETBRANCHES}clientDataId=${companyId}`)
			.pipe(map(Items => Items.data));
	}

	UploadImagesForBranch(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_UPLOADIMAGE}`);
	}

	getBranchDataById(id: number, CompanyBranchId: number): Observable<IBranchAddModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_GETBYID}CompanyBranchId=${CompanyBranchId}&Id=${id}`)
			.pipe(map(data => data.data));
	}

	getBranchsNotAssignedToPathRoute(CompanyBranchId: number, StateId?: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}
		${HttpPaths.API_CLIENTBRANCH_GETNOT_ASSIGNEDTO_PATHROUTE}CompanyBranchId=${CompanyBranchId}&StateId=${StateId}`)
			.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

	toggleActiveDeactive(model: IBranch): Observable<any> {
		return this.http.CommonPutRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCH_TOGGLE}${model.id}`);
	}

	toggleSalesActiveDeactive(model: IBranch): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_BRANCH_SALESPERSONLOCKUNLOCK}${model.id}`);
	}


	PostBranchData(model: IBranchAddModel): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_ADD}`);
	}

	AssignPathRouteToClientBranch(model: IclientBranchAssignPathModel) {
		return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ASSIGN_CLIENTBRANCH_TO_PATHROUTE}ClientBranchId=${model.ClientBranchId}&PathRouteId=${model.PathRouteId}`);
	}

	DeAssignPathRouteToClientBranch(branchId: number) {
		return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCH_TO_DEASSIGN_PATHROUTE}clientBranchId=${branchId}`);
	}

	getPathRoutesLogs(clientBranchId: number): Observable<IBranchPathRoutesLogs[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCH_PATHROUTE_LOGS}clientBranchId=${clientBranchId}`)
			.pipe(map((Items: HttpReponseModel) => Items.data as IBranchPathRoutesLogs[]));
	}

	UpdateBranchData(model: IBranchAddModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_UPDATE}${model.id}`);
	}

	listOfClientBranch(clientId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_CLIENT_BRANCH_BY_ID}${clientId}`).pipe(
			map(Items => Items.data.map((item: any) => ({ Id: item.id, Name: item.name })) as LookUpModel[])
		)
	}
	
	listOfClientBranchByEmployeeId(employeeId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_CLIENT_BRANCH_BY_EMPLOYEE_ID}${employeeId}`).pipe(
			map(Items => Items.data.map((item: any) => ({ Id: item.id, Name: item.name })) as LookUpModel[])
		)
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}