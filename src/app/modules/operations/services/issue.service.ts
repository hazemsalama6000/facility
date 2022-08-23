import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IIssueDetails } from '../models/IIssueDetails.interface';
import { IISsueMaster } from '../models/IISsueMaster.interface';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  IssueMaster = new BehaviorSubject<IISsueMaster>({id:0});

  constructor(private http: CommonHttpService) { }

  getIssueMasterData(flag:boolean):Observable<IISsueMaster[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ISSUEMASTER}${flag}`)
      .pipe(map((Items: any) => Items.data as IISsueMaster[]))
  }


 getIssueDetailsData(issueId:number,flag:boolean=true) {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_ISSUEDETAILS}${flag}?issueId=${issueId}`)
      .pipe(map((Items: any) => Items.data as IIssueDetails[]))
  }
}
