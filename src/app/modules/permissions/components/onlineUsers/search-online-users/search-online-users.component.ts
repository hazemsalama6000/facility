import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IOnlineUsers } from "../../../models/IOnlineUsers.interface";
import { IOnlineUsersCountPerCompany } from "../../../models/IOnlineUsersCountPerCompany.interface";
import { IOnlineUsersSearch } from '../../../models/IOnlineUsersSearch.interface'
import { OnlineUsersService } from "../../../services/onlineUsers.service";
@Component({
	selector: "search-online-Users",
	templateUrl: './search-online-users.component.html',
	styleUrls: ['./search-online-users.component.scss']
})

export class SearchOnlineUsersComponent implements OnInit {

	SearchOnlineUsersForm: FormGroup;
    onlineUsersGrouped : IOnlineUsersCountPerCompany[];
	dropCompaniesData: LookUpModel[] = []

	constructor(private fb: FormBuilder, private service: OnlineUsersService, private companyService: CompanyService) { }

	ngOnInit(): void {

		this.service.clickSearch$.subscribe((data: boolean) => {
			if (data) {
				document.getElementById('search')?.click();
			}
		});

		this.SearchOnlineUsersForm = this.fb.group({
			companyId: [''],
			userStates: [true]
		});

		this.companyService.getActiveCompanies().subscribe(
			(data: LookUpModel[]) => {
				this.dropCompaniesData = data;
			}
		);

		this.searchOnlineUsers({companyId:undefined , userStates:true});


	}

	searchOnlineUsers(OnlineUsersModel: IOnlineUsersSearch) {

		this.service.getOnlineUsersData(OnlineUsersModel.userStates, OnlineUsersModel.companyId)
			.subscribe((data: IOnlineUsers[]) => {
				this.service.bSubject.next(data);
			});

		this.service.OnlineUserCountForEachCompany(OnlineUsersModel.companyId).subscribe((data : IOnlineUsersCountPerCompany[]) => {
			this.onlineUsersGrouped = data;
		});

	}



}