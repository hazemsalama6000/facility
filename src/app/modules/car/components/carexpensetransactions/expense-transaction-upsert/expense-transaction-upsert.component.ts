import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IExpenseTransaction } from "../../../models/IExpenseTransaction.interface";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { CarExpenseTransactionService } from "../../../services/car-expense-transactions.service";
import { CarService } from "../../../services/cars.service";
import { DatePipe } from "@angular/common";

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
		private fb: FormBuilder,
		private toaster: toasterService,
		private auth: AuthService,
		private carExpenseTransactionService: CarExpenseTransactionService,
		private carService: CarService, private datePipe: DatePipe
	) { }


	setDefaultForForm() {
		this.expenseTransactionDataForm = this.fb.group({
			ExpenseId: ['', Validators.compose([Validators.required])],
			CarDataId: ['', Validators.compose([Validators.required])],
			Attachments: [''],
			Notes: [''],
			ExpenseDate: [new Date().toISOString(), Validators.compose([Validators.required])],
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


	ngOnInit() {

		this.setDefaultForForm();
		this.fillDropDowns();

	}


	logoPrintChange(event: any) {
		this.attachment = <File>event.target.files[0];
	}


	Submit(ExpenseTransactionDataForm: any) {

		console.log(ExpenseTransactionDataForm);

		if (this.expenseTransactionDataForm.valid) {

			ExpenseTransactionDataForm.ExpenseDate = this.datePipe.transform(ExpenseTransactionDataForm.ExpenseDate, 'MM/dd/yyyy')!;

			const fd = new FormData();
			
			if (this.attachment != null) {
				fd.append('Attachments', this.attachment, this.attachment.name);
			}

			fd.append('CarDataId', ExpenseTransactionDataForm.CarDataId.toString());
			fd.append('ExpenseDate', ExpenseTransactionDataForm.ExpenseDate);
			fd.append('ExpenseId', ExpenseTransactionDataForm.ExpenseId);
			fd.append('ExpenseValue', ExpenseTransactionDataForm.ExpenseValue);
			fd.append('Notes', ExpenseTransactionDataForm.Notes);

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