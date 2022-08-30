import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpPaths } from 'src/app/modules/auth/Enums/HttpPaths.enum';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { CommonHttpService } from '../httpServices/CommonHttpService.service';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {

	constructor(private http:CommonHttpService) {}

  getLookUpTechnician(companyBranch_Id:Number): Observable<LookUpModel[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_TECHNICIAN}${companyBranch_Id}`)
      .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  }

}
