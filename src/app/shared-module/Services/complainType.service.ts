import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from 'src/app/modules/auth/Enums/HttpPaths.enum';
import { complainType } from '../models/complain.interface';
import { LookUpModel } from '../models/lookup';

@Injectable({
	providedIn: 'root'
})
export class ComplainTypeService {

	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);

	constructor(private http: CommonHttpService) { }

	getLookupData(companyId: number): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_COMPLAINT_TYPE}`)
			.pipe(map(Items => Items.data?.map((Item: any) => ({ Id: Item.id, Name: Item.name, isActive: Item.isAttachedImage, isEdit: false, isAdd: false }) as LookUpModel)));
	}

	PostLookupData(model: LookUpModel): Observable<any> {
		let obj:complainType={id:model.Id,name:model.Name,isAttachedImage:model.isActive};
		return this.http.CommonPostRequests(obj, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_COMPLAINT_TYPE}`);
	}


	UpdateLookupData(model: LookUpModel): Observable<any> {
		let obj:complainType={id:model.Id,name:model.Name,isAttachedImage:!model.isActive};
		//console.log(obj,model)
		return this.http.CommonPutRequests(obj, `${localStorage.getItem("companyLink")}${HttpPaths.API_UPDTAE_COMPLAINT_TYPE}${model.Id}`);
	}

	DeleteLookupData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_DELETE_COMPLAINT_TYPE}${id}`);
	}

	selectFromStore(): Observable<any> {
		return this.bSubject.asObservable();
	}
}
