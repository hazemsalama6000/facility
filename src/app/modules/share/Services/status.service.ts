import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IJob } from '../models/IJob.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: CommonHttpService) { }

  getLookUpData(): Observable<any> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_STATUS_GETLIST}`)
	.pipe( map(Items=> Items.map( (Item:any) => ({Id:Item.id,Name:Item.name,isActive:Item.isActive , isEdit:false , isAdd:false}) as LookUpModel )  ) );
	;
  }

}
