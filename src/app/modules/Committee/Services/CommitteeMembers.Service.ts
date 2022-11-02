import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { CommitteeMember } from "../Models/CommitteeMember";

@Injectable({providedIn:"root"})
export class CommitteeMemberService {
    companyId: number;
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
    constructor(private http: CommonHttpService, private auth: AuthService)
    {
        this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
    }
    GetAllCommitteeMeembers():Observable<CommitteeMember[]>{
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_GETCOMMITTEEMEMBERS}`)
			.pipe(map(conf => conf.data as CommitteeMember[]))
    }
    ListOfCommitteeMeembers():Observable<CommitteeMember[]>{
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_LISTOFCOMMITTEEMEMBERS}`)
			.pipe(map(conf => conf.data as CommitteeMember[]))
    }
	AddCommitteeMeembers(model : CommitteeMember):Observable<any>{
		return this.http.CommonPostRequests(model,`${environment.apiUrl}${HttpPaths.API_POST_ADDCOMMITTEEMEMBERS}`)
	}
	UpdateCommitteeMeembers(model : CommitteeMember):Observable<any>{
		return this.http.CommonPutRequests(model,`${environment.apiUrl}${HttpPaths.API_PUT_UPDATECOMMITTEEMEMBERS}${model.id}`)
	}
	DeleteCommitteeMeembers(model : CommitteeMember):Observable<any>{
		return this.http.CommonDeleteRequest(`${environment.apiUrl}${HttpPaths.API_DELETE_COMMITTEEMEMBERS}${model.id}`)
	}
}