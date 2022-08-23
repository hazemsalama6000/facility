import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tab } from "bootstrap";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth";
import { CompanyItemComponent } from "../../hr/components/companyProfile/companys-dataList/company-item/companys-item.component";
import { ILocationXY } from "../models/ILocationXY.interface";
import { IOnlineUsers } from "../models/IOnlineUsers.interface";
import { IOnlineUsersCountPerCompany } from "../models/IOnlineUsersCountPerCompany.interface";
import { IUserLogsSearchBox } from "../models/IUserLogsSearchBox.interface";

@Injectable({
	providedIn: 'root'
})

export class OnlineUsersService {

	bSubject = new BehaviorSubject<IOnlineUsers[]>([]);
	clickSearch$ = new BehaviorSubject<boolean>(false);
	Locations = new BehaviorSubject<ILocationXY[]>([]);

	iconBase = "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
	iconString = 'http://maps.google.com/mapfiles/ms/icons';
	icons = {
		ClientLocationIcon: {
			icon: this.iconBase + "library_maps.png",
		},
		NotActiveLocation: {
			icon: this.iconString + "/blue-dot.png",
		},
		ActiveLocationIcon: {
			icon: this.iconString + "/green-dot.png",
		},
		StartLocationIcon: {
			icon: this.iconString + "/red-dot.png",
		}
	};

	constructor(private http: CommonHttpService, private auth: AuthService) {
	}

	getOnlineUsersData(connectionStatus?: boolean, companyId?: number): Observable<IOnlineUsers[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_ONLINE_USERS}?connectionStatus=${connectionStatus == null ? '' : connectionStatus}&&companyId=${!!companyId ? companyId : ''}`)
			.pipe(map((data: HttpReponseModel) => data.data as IOnlineUsers[]));
	}


	getUsersLogHistoryData(userLogsSearchModel: IUserLogsSearchBox): Observable<IOnlineUsers[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_USERS_CONNECTION_LOGS}?empId=${userLogsSearchModel.empId}&&startDate=${userLogsSearchModel.startDate}&&endDate=${userLogsSearchModel.endDate}`)
			.pipe(map((data: HttpReponseModel) => data.data as IOnlineUsers[]));
	}

	OnlineUserCountForEachCompany(companyId?: number): Observable<IOnlineUsersCountPerCompany[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_ONLINE_USERS_FOREACH_COMPANY}?companyId=${!!companyId ? companyId : ''}`)
			.pipe(map((data: IOnlineUsersCountPerCompany[]) => data as IOnlineUsersCountPerCompany[]));
	}


	getOnlineUsersCurrentLocationData(userId: number): Observable<ILocationXY[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_ONLINE_USERES_LASTLOCATION}?empsIds=${userId}`)
			.pipe(map((data: HttpReponseModel) => data.data as ILocationXY[]));
	}

	getUsersLocationLogs(userLogsSearchModel: IUserLogsSearchBox): Observable<ILocationXY[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_USRS_LOCATION_LOGS}?employeeId=${userLogsSearchModel.empId}&&startDate=${userLogsSearchModel.startDate}&&endDate=${userLogsSearchModel.endDate}`)
			.pipe(map((data: HttpReponseModel) => data.data.map((item: any) => ({ x: item.x, y: item.y, date: item.date, empName: item.name, status: item.status }) as ILocationXY)));
	}


	checkIconBasedLocation(status?: boolean) {
		if (status == true) {
			return this.icons["ActiveLocationIcon"].icon
		}
		else if (status == false) {
			return this.icons["StartLocationIcon"].icon
		}
		else {
			return this.icons["NotActiveLocation"].icon
		}
	}

}