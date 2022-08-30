import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { dropdownSettings } from "src/app/core-module/UIServices/dropdownsetting";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { ICompany } from "src/app/modules/hr/models/ICompany";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ChangeDetectorRef } from '@angular/core';
import { IExpenseTransaction } from "../../../models/IExpenseTransaction.interface";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { CarExpenseTransactionService } from "../../../services/car-expense-transactions.service";
import { CarService } from "../../../services/cars.service";

@Component({
	selector: "expense-transaction-upsert",
	templateUrl: './expense-transaction-upsert.component.html',
	styleUrls: ['./expense-transaction-upsert.component.scss']
})

export class CarTransactionUpsertComponent implements OnInit {

	saveButtonClickedFlag = false;
	branchId: number;
	isEdit = false;
	expenseTransaction: IExpenseTransaction;
	attachment: File;
	isEditable: boolean = false;

	dropdownCarsData: LookUpModel[] = [];
	dropdownCarExpenseTypesData: LookUpModel[] = [];


	panelOpenState: boolean = true;

	expenseTransactionDataForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private auth: AuthService,
		private carExpenseTransactionService: CarExpenseTransactionService,
		private carService: CarService,
	) {

		//here get data of company and put data in the form

	}


	setDefaultForForm() {
		this.expenseTransactionDataForm = this.fb.group({
			ExpenseId: ['', Validators.compose([Validators.required])],
			CarDataId: ['', Validators.compose([Validators.required])],
			Attachments: [''],
			Notes: [''],
			ExpenseDate: [''],
			ExpenseValue: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
		});
	}


	fillDropDowns() {

		this.auth.userData.subscribe((data: IUserData) => {

			this.branchId = data.branchId;

			this.carService.getLookupCarData(data.branchId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarsData = data;
			});

			this.carExpenseTransactionService.getLookupCarExpenseTypesData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownCarExpenseTypesData = data;
			});

		});
	}

	// initialize Form With Validations
	initForm() {
		this.fillDropDowns();
	}


	ngOnInit() {

		this.setDefaultForForm();

		this.initForm();

	}


	logoPrintChange(event: any) {
		this.attachment = <File>event.target.files[0];
	}

	
	Submit(ExpenseTransactionDataForm: any) {

		if (this.expenseTransactionDataForm.valid) {

			const fd = new FormData();

			fd.append('Attachments', this.attachment, this.attachment.name);
			fd.append('CarDataId', ExpenseTransactionDataForm.id.toString());
			fd.append('ExpenseDate', ExpenseTransactionDataForm.code);
			fd.append('ExpenseId', ExpenseTransactionDataForm.companyName);
			fd.append('ExpenseValue', ExpenseTransactionDataForm.activity);
			fd.append('Notes', ExpenseTransactionDataForm.address);

			this.carExpenseTransactionService.PostExpenseTransactionData(fd).
				subscribe(
					(data: HttpReponseModel) => {

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
						}
						else if (data.isExists) {
							this.toaster.openWarningSnackBar(data.message);
						}
					},
					(error: any) => {
						console.log(error);
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					}
				);

		}

	}



}