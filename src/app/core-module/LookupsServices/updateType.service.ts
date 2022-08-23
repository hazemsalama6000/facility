import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { CommonHttpService } from "../httpServices/CommonHttpService.service";
import { HttpReponseModel } from "../models/ResponseHttp";

@Injectable({providedIn:'root'})

export class UpdateTypeService {

	constructor(private http:CommonHttpService) {}

	getLookupUpdateTypeData(companyId: number): Observable<LookUpModel[]> {
				return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_CUSTOMERUPDATETYPE}`)
					.pipe(map((Items:HttpReponseModel) => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
/*		return of([{ Id: 1, Name: 'Update1' } as LookUpModel, { Id: 1, Name: 'Update2' } as LookUpModel]);
*/	}

}