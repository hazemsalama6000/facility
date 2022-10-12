import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
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

	getBranchDataById(id: number, CompanyBranchId: number): Observable<IBranchAddModel> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_GETBYID}CompanyBranchId=${CompanyBranchId}&Id=${id}`)
			.pipe(map(data => data.data));
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

	AssignPathRouteToClientBranch(model : IclientBranchAssignPathModel) {
		return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_ASSIGN_CLIENTBRANCH_TO_PATHROUTE}ClientBranchId=${model.ClientBranchId}&PathRouteId=${model.PathRouteId}`);
	}

	getPathRoutesLogs(clientBranchId: number): Observable<IBranchPathRoutesLogs[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCH_PATHROUTE_LOGS}clientBranchId=${clientBranchId}`)
			.pipe(map((Items: HttpReponseModel) => Items.data as IBranchPathRoutesLogs[]));
	}

	UpdateBranchData(model: IBranchAddModel): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENTBRANCHES_UPDATE}${model.id}`);
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}


}