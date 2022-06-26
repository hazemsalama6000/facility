import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { EmployeeService } from "src/app/modules/hr/services/employee.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IOnlineUsers } from "../../../models/IOnlineUsers.interface";
import { IOnlineUsersCountPerCompany } from "../../../models/IOnlineUsersCountPerCompany.interface";
import { IOnlineUsersSearch } from '../../../models/IOnlineUsersSearch.interface'
import { IUserLogsSearchBox } from "../../../models/IUserLogsSearchBox.interface";
import { OnlineUsersService } from "../../../services/onlineUsers.service";
@Component({
	selector: "search-user-logs",
	templateUrl: './search-user-logs.component.html',
	styleUrls: ['./search-user-logs.component.scss']
})

export class SearchUserLogsComponent implements OnInit {

	SearchUsersConnectionLogsForm: FormGroup;
	dropUsersData: LookUpModel[] = []

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: OnlineUsersService, private employeeService: EmployeeService, private datePipe: DatePipe) { }

	ngOnInit(): void {

		this.service.clickSearch$.subscribe((data: boolean) => {
			if (data) {
				document.getElementById('search')?.click();
			}
		});

		this.SearchUsersConnectionLogsForm = this.fb.group({
			empId: [null],
			startDate: [new Date().toISOString()],
			endDate: [new Date().toISOString()]
		});

		this.employeeService.getLookupEmployeeData(1005).subscribe(
			(data: LookUpModel[]) => {
				this.dropUsersData = data;
			}
		);

		//this.searchOnlineUsers({companyId:undefined , userStates:true});

	}

	searchUsersConnectionLogs(userLogsSearch: IUserLogsSearchBox) {

		if (userLogsSearch.empId == null || userLogsSearch.endDate == '' || userLogsSearch.startDate == '') {
			this.toaster.openWarningSnackBar('تاكد من ادخال التاريخ والموظف');
			return;
		}

		userLogsSearch.startDate = this.datePipe.transform(userLogsSearch.startDate, 'MM/dd/yyyy')!;
		userLogsSearch.endDate = this.datePipe.transform(userLogsSearch.endDate, 'MM/dd/yyyy')!;

		this.service.getUsersLogHistoryData(userLogsSearch)
			.subscribe(
				(data: IOnlineUsers[]) => {
					this.service.bSubject.next(data);
				}, (error) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				}
			);


	}



}