import { Injectable } from "@angular/core";
import { Data } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IClientDisplayedData } from "../models/IClientDisplayedData.interface";
import { ICompany } from "../models/ICompany";
import { ICompanyDisplayData } from "../models/ICompanyDisplayData";

@Injectable({
	providedIn: 'root'
})

export class ClientService {
	bSubject = new BehaviorSubject(true);

	constructor(private http: CommonHttpService) { }

	getCompanyData(): Observable<IClientDisplayedData[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_GETALL}`)
			.pipe(map(Items => Items.data.map((Item: IClientDisplayedData) => Item as IClientDisplayedData)));
	}


	getClientCategories(companyId:number) : Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_CLIENT_CATEGORY_LIST}${companyId}`)
		.pipe(map(Items =>  Items.data.map( (item:any) =>  ({Id:item.id,Name:item.name }) as LookUpModel  ) ));
	}

	getActiveCompanies() : Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_GETACTIVE}`)
		.pipe(map(Items =>  Items.map( (item:any) =>  ({Id:item.id,Name:item.name }) as LookUpModel  ) ));
	}

	getCompanyDataById(id: number): Observable<ICompany> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_GETBYID}${id}`)
		.pipe(map(Items =>  Items as ICompany  ));
	}

	PostCompanyData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_ADD}`);
	}

	UpdateCompanyData(model: ICompany): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_UPDATE}${model.id}`);
	}

	changeLogoWebData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_CHANGELOGOWEB}`);
	}

	changeLogoPrint(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_CHANGELOGOPRINT}`);
	}

	activeOrNot(model: any): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_ACTIVEORNOT}${model.id}`);
	}


}