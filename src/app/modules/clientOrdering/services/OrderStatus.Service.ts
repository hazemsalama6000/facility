import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { OrderStatus } from "../Models/OrderStatus";

@Injectable({
	providedIn: 'root'
})
export class OrderStatusService {
	companyId: number;
	bSubject = new BehaviorSubject(true);
	addFlag = new BehaviorSubject(false);
	constructor(private http: CommonHttpService, private auth: AuthService) {
		this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
		});
	}

	ListOfOrderStatus(): Observable<LookUpModel[]> {
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_LISTOFORDERSTATUS}`)
			.pipe(map(conf => conf.data.map((item: any) => ({ Id: item.id, Name: item.name })) as LookUpModel[]))
	}

	GetAllOrderStatus(): Observable<OrderStatus[]> {
		return this.http.CommonGetRequests(`${environment.apiUrl}${HttpPaths.API_GET_GETORDERSTATUS}`)
			.pipe(map(conf => conf.data as OrderStatus[]))
	}

	AddOrderStatus(model: OrderStatus): Observable<any> {
		return this.http.CommonPostRequests(model, `${environment.apiUrl}${HttpPaths.API_POST_ADDORDERSTATUS}`)
	}

	UpdateOrderStatus(model: OrderStatus): Observable<any> {
		return this.http.CommonPutRequests(model, `${environment.apiUrl}${HttpPaths.API_PUT_UPDATEORDERSTATUS}${model.id}`)
	}

	DeleteOrderStatus(model: OrderStatus): Observable<any> {
		return this.http.CommonDeleteRequest(`${environment.apiUrl}${HttpPaths.API_DELETE_ORDERSTATUS}${model.id}`)
	}
}