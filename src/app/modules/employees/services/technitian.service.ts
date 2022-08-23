import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { HttpPaths } from "../../auth/Enums/HttpPaths.enum";
import { ITechnitianLog } from "../models/ITechnitianLog.interface";

@Injectable()
export class TechnitianService {

	constructor(private http: CommonHttpService) { }

	toggleIsTechnician(employeeId: number): Observable<HttpReponseModel> {
		return this.http.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_TOGGLE_EMPLOYEE_TECHNICIAN}?EmployeeId=${employeeId}`);
	}

	addTechnicianLog(technicianLog: ITechnitianLog) {
		return this.http.CommonPostRequests(technicianLog, `${localStorage.getItem("companyLink")}${HttpPaths.API_ADD_TECHNICIAN}`);
	}

	getTechnicianLogByEmpId(employeeId: number): Observable<ITechnitianLog[]> {
			return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_GET_TECHNNICIAN_DATA}?EmployeeId=${employeeId}`).pipe(
				map((data: HttpReponseModel) => data.data)
			);

	}
	///

}