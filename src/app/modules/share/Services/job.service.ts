import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IJob } from '../models/IJob.interface';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: CommonHttpService) { }

  getLookUpData(Id: number): Observable<any> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_GETPERSECTION}${Id}`);
  }

  getJobData(Id: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_GETPERSECTION}${Id}`)
			.pipe(map(Items => Items.data.jobs.map((Item: any) => ({ Id: Item.id, Name: Item.displayValue, isActive: Item.isSelected }) as LookUpModel)));
	}

  getListData(Id: number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_GET_LISTJOBPERSECTION}?SectionId=${Id}`)
    .pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name })) as LookUpModel[]));
  }

  postLookUpData(model: IJob): Observable<any> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_JOB_UPDATEJOBPERSECTION}`);
  }

}