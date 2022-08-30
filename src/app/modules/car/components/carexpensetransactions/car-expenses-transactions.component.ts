import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IExpenseCarSearch } from "../../models/IExpenseCarSearch.interface";
import { CarExpenseTransactionService } from "../../services/car-expense-transactions.service";


@Component({
	selector: 'car-expense-transactions',
	templateUrl: './car-expenses-transactions.component.html',
	styleUrls: ['./car-expenses-transactions.component.scss'],
})

export class CarExpensesTransactionComponent implements OnInit {

	dropdownCarsData: LookUpModel[] = [];
	dropdownCarExpenseTypesData: LookUpModel[] = [];

	carExpenseTransactionSearchForm: FormGroup;
	searchModel: IExpenseCarSearch = {} as IExpenseCarSearch;

	constructor(
		private carExpenseTransactionService: CarExpenseTransactionService,
		private toaster: toasterService, private fb: FormBuilder,
		private auth: AuthService, private datePipe: DatePipe) {
	}

	ngOnInit(): void {

		this.carExpenseTransactionSearchForm = this.fb.group({
			carPlat: [],
			expense_Id: [],
			startDate: [new Date().toISOString()],
			endDate: [new Date().toISOString()]
		});

		this.auth.userData.subscribe((data: IUserData) => {
/*
			this.branchService.getLookupBranchData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarsData = data;
			});*/

			this.carExpenseTransactionService.getLookupCarExpenseTypesData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarExpenseTypesData = data;
			});
			
		});

	}
	
	
	searchCustomerEdits(model: IExpenseCarSearch) {
		model.startDate = this.datePipe.transform(model.startDate, 'MM/dd/yyyy')!;
		model.endDate = this.datePipe.transform(model.endDate, 'MM/dd/yyyy')!;
	
		this.carExpenseTransactionService.searchParameterAction.next(model);
		this.carExpenseTransactionService.searchUpdateUserManageAction.next(true);
	
	}


}