import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpPaths } from 'src/app/modules/auth/Enums/HttpPaths.enum';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { CommonHttpService } from '../httpServices/CommonHttpService.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

	constructor(private http:CommonHttpService) {}

	getLookupStateData(branchId?: number): Observable<LookUpModel[]> {
				return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_LIST_OF_STATES}`)
					.pipe(map(Items => Items.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

}
