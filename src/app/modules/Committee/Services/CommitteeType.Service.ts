import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { CommitteeType } from "../Models/CommitteeType";

@Injectable({providedIn:'root'})
export class CommitteeTypeService {
    companyId: number;
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
    constructor(private http: CommonHttpService, private auth: AuthService)
    {
        this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
    }

    ListOfCommitteeTypes():Observable<CommitteeType[]>{
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_LISTOFCOMMITTEETYPES}`)
			.pipe(map(conf => conf.data as CommitteeType[]))
    }
	AddCommitteeTypes(model : CommitteeType):Observable<any>{
		return this.http.CommonPostRequests(model,`${environment.apiUrl}${HttpPaths.API_POST_ADDCOMMITTEETYPES}`)
	}
	UpdateCommitteeTypes(model : CommitteeType):Observable<any>{
		return this.http.CommonPutRequests(model,`${environment.apiUrl}${HttpPaths.API_PUT_UPDATECOMMITTEETYPES}${model.id}`)
	}
	DeleteCommitteeTypes(model : CommitteeType):Observable<any>{
		return this.http.CommonDeleteRequest(`${environment.apiUrl}${HttpPaths.API_DELETE_COMMITTEETYPES}${model.id}`)
	}
}