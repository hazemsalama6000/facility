import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { AuthService } from "../../auth";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { NotiModule } from "../models/NotiModule/NotiModule";

@Injectable({
    providedIn:'root'
})
export class notiModule {
    bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
    constructor(private http: CommonHttpService, private auth: AuthService) {
		this.auth.userData.subscribe((userData) => {
		});
	}
    GetAllnotiModule():Observable<NotiModule[]>{
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_NotiModules}`)
			.pipe(map(conf => conf.data as NotiModule[]))
    }
	AddnotiModule(model : NotiModule):Observable<any>{
		return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_POST_ADDNotiModules}`)
	}
	UpdatenotiModule(model : NotiModule):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_PUT_UPDATENotiModules}${model.id}`)
	}
	DeletenotiModule(model : NotiModule):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_DELETENotiModules}${model.id}`)
	}
}