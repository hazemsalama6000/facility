import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { CommonHttpService } from "../httpServices/CommonHttpService.service";

@Injectable({providedIn:'root'})

export class BlockService {
	constructor(private http:CommonHttpService) {}

	

	getLookupBlockData(areaId: number): Observable<LookUpModel[]> {
				return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_BLOCK_URL}?areaId=${areaId}`)
					.pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
	}

}