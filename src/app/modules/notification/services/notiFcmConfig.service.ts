import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { AuthService } from "src/app/modules/auth";
import { FcmConfig } from "../models/fcmconfig/FcmConfig";

import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { FcmConfUpdate } from "../models/fcmconfig/FcmConfUpdate";

@Injectable({
	providedIn: 'root'
})
export class FcmConfigService {

    companyId: number;
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);

	emitStateIdSubject = new BehaviorSubject<FcmConfig>({ id: 0, projectId: "", apiKey: "", isAndroid: false, authDomain: "", appId: "", measurementId : "" , messagingSenderId : "" , publicKey : "" , senderId : "" , serverKey : "" , storageBucket : "" });

    constructor(private http: CommonHttpService, private auth: AuthService) {
		this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
	}

    GetAllFcmConf():Observable<FcmConfig[]>{
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_FCMCONFIG}`)
			.pipe(map(conf => conf.data as FcmConfig[]))
    }

	AddFcmConfig(model : FcmConfUpdate):Observable<any>{
		return this.http.CommonPostRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_POST_ADDFCMCONF}`)
	}
	UpdateFcmConfig(model : FcmConfUpdate):Observable<any>{
		return this.http.CommonPutRequests(model,`${localStorage.getItem("companyLink")}${HttpPaths.API_PUT_UPDATEFCMCONF}${model.Id}`)
	}
	DeleteFcmConfig(model : FcmConfig):Observable<any>{
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_DELETEFCMCONF}${model.id}`)
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}
	
}