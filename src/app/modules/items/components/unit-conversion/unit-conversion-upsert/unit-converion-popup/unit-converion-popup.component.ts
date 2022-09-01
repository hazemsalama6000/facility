import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { DatePipe } from "@angular/common";
import { ItemService } from "src/app/modules/items/services/item.service";
import { UnitService } from "src/app/modules/items/services/units.service";

@Component({
	selector: "unit-converion-popup",
	templateUrl: './unit-converion-popup.component.html',
	styleUrls: ['./unit-converion-popup.component.scss']
})

export class UnitConverionPopupComponent implements OnInit {

	saveButtonClickedFlag = false;
	branchId: number;
	isEdit = false;
	attachment: File;
	isEditable: boolean = false;

	dropdownItems: LookUpModel[] = [];
	dropdownRelatedUnits: LookUpModel[] = [];


	panelOpenState: boolean = true;

	unitConversionDataForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private toaster: toasterService,
		private auth: AuthService,
		private itemService: ItemService,
		private unitService: UnitService, private datePipe: DatePipe
	) { }


	setDefaultForForm() {
		this.unitConversionDataForm = this.fb.group({
			unit_Id: ['', Validators.compose([Validators.required])],
			itemData_Id: ['',Validators.compose([Validators.required])],
			barcode: [''],
			factor: [0, Validators.compose([ Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
		});
	}


	fillDropDowns() {
		this.auth.userData.subscribe((data: IUserData) => {
			this.itemService.getLookUpItems(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownItems = data;
			});
		});
	}

	filterItemRelatedUnits(itemId:number){
		this.unitService.getLookUpItemsRelatedUnits(itemId).subscribe((data: LookUpModel[]) => {
			this.dropdownRelatedUnits = data;
		});
	}

	ngOnInit() {
		this.setDefaultForForm();
		this.fillDropDowns();
	}


	/*Submit(ExpenseTransactionDataForm: any) {

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
							this.carExpenseTransactionService.searchUpdateUserManageAction.next(true);

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
*/


}