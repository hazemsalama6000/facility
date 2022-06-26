import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IJob } from '../models/IJob.interface';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: CommonHttpService) { }

  getLookUpData(Id:number): Observable<any> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_GETPERSECTION}${Id}`);
  }

  postLookUpData(model: IJob): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_UPDATEJOBPERSECTION}`);
  }

}