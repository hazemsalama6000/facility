import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { CommitteeMember } from "../Models/CommitteeMember";
import { CommitteeRequest } from "../Models/CommitteeRequest";
import { CommitteeResponse } from "../Models/CommitteeResponse";

@Injectable({providedIn:'root'})
export class CommitteeServices {
    companyId: number;
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
    constructor(private http: CommonHttpService, private auth: AuthService)
    {
        this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
    }
    GetAllCommittees():Observable<CommitteeResponse[]>{
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_GETCOMMITTEES}`)
			.pipe(map(conf => conf.data as CommitteeResponse[]))
    }
	GetCommitteeMembers(model : CommitteeRequest):Observable<CommitteeMember[]>{
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_GETCOMMITTEEMEMBERSDETAILS}?Id=${model.id}`)
			.pipe(map(conf => conf.data as CommitteeMember[]))
    }
	AddCommittee(model : CommitteeRequest):Observable<any>{
		return this.http.CommonPostRequests(model,`${environment.apiUrl}${HttpPaths.API_POST_ADDCOMMITTEE}`)
	}
	UpdateCommittee(model : CommitteeResponse):Observable<any>{
		return this.http.CommonPutRequests(model,`${environment.apiUrl}${HttpPaths.API_PUT_UPDATECOMMITTEE}${model.id}`)
	}
	DeleteCommittee(model : CommitteeResponse):Observable<any>{
		return this.http.CommonDeleteRequest(`${environment.apiUrl}${HttpPaths.API_DELETE_COMMITTEE}${model.id}`)
	}
}