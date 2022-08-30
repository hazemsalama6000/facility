import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DialogPosition, MatDialog } from "@angular/material/dialog";

import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IExpenseCarSearch } from "../../models/IExpenseCarSearch.interface";
import { CarExpenseTransactionService } from "../../services/car-expense-transactions.service";
import { CarService } from "../../services/cars.service";
import { CarTransactionUpsertComponent } from "./expense-transaction-upsert/expense-transaction-upsert.component";


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

	branchId: number;

	constructor(
		private carExpenseTransactionService: CarExpenseTransactionService,
		private carService: CarService,
		private toaster: toasterService, private fb: FormBuilder,
		private auth: AuthService, private datePipe: DatePipe,
		private dialog: MatDialog) {
	}

	ngOnInit(): void {

		this.carExpenseTransactionSearchForm = this.fb.group({
			carPlat: [],
			expense_Id: [],
			startDate: [new Date().toISOString()],
			endDate: [new Date().toISOString()]
		});

		this.auth.userData.subscribe((data: IUserData) => {

			this.branchId = data.branchId;

			this.carService.getLookupCarData(data.branchId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarsData = data;
			});

			this.carExpenseTransactionService.getLookupCarExpenseTypesData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarExpenseTypesData = data;
				this.searchCarExpensesTransactions({ pageNumber: 0, expense_Id: 0, pageSize: 0, branchId: 0, carPlat: 0, endDate: '', startDate: '' })

			});

		});

	}


	searchCarExpensesTransactions(model: IExpenseCarSearch) {
		model.startDate = this.datePipe.transform(model.startDate, 'MM/dd/yyyy')!;
		model.endDate = this.datePipe.transform(model.endDate, 'MM/dd/yyyy')!;
		model.branchId = this.branchId;

		this.carExpenseTransactionService.searchParameterAction.next(model);
		this.carExpenseTransactionService.searchUpdateUserManageAction.next(true);
	}


	
	openDialog() {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(CarTransactionUpsertComponent,
			{
				maxHeight: '100vh',
				height: '100%',
				position: dialogPosition
						});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

}