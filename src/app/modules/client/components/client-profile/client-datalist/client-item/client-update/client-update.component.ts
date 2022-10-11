import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { dropdownSettings } from "src/app/core-module/UIServices/dropdownsetting";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ChangeDetectorRef } from '@angular/core';
import { IClientForm } from "src/app/modules/client/models/IClientForm.interface";
import { ClientService } from "src/app/modules/client/services/client.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { IClientUpsertModel } from "src/app/modules/client/models/IClientUpsertModel.interface";
import { IClientDisplayedData } from "src/app/modules/client/models/IClientDisplayedData.interface";

@Component({
	selector: "client-update",
	templateUrl: './client-update.component.html',
	styleUrls: ['./client-update.component.scss']
})

export class ClientUpdateComponent implements OnInit {

	saveButtonClickedFlag = false;

	isEdit = false;
	client: IClientDisplayedData;
    companyBranchId=0;
	
	dropdownCategoryData:any=[];



	dropdownSettings = dropdownSettings;

	panelOpenState: boolean = true;

	clientDataForm: FormGroup;
	companyBranch:number;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private service: ClientService,
		private auth:AuthService
	) {

		//here get data of company and put data in the form

	}
	setDefaultForForm() {

		
			this.clientDataForm = this.fb.group({
				id: [0],
			//	Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				CommercialName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
			//	responsibleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				
				taxCardNum: [0, Validators.compose([Validators.required,Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				vatTaxNum: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				withHoldTax: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],

				
				isVatTaxActive: [false,],
				isWithHoldTaxActive: [false,],
				//isAddedClientBranch: [false,],

				clientCategory_Id: ['', Validators.compose([Validators.required])],
			//	address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

			/*	telephone: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				secondMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				managerMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
*/
				activity: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
/*				state_Id: ['', Validators.compose([Validators.required])],
				region_Id: ['', Validators.compose([Validators.required])],
*/				
		        isActive: [false,],
			});
		

	}


	fillDropDowns() {
		
		this.auth.userData.subscribe((data: IUserData) => {

			this.companyBranch = data.branchId;
			this.service.getClientCategories(data.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCategoryData = data;
				}
			);

		});

	}


	ngOnInit() {
		this.setDefaultForForm();

		this.initForm();

	}

	// initialize Form With Validations
	initForm() {

		this.auth.userData.subscribe((data: IUserData) => {

			this.companyBranch = data.branchId;
			
			this.service.getClientsDataProfile(this.data.clientId,this.companyBranch).subscribe(
				(data: IClientDisplayedData) => {
					console.log(data);
					this.clientDataForm.controls['id'].setValue(data.id);
					this.clientDataForm.controls['name'].setValue(data.name);
					this.clientDataForm.controls['CommercialName'].setValue(data.commercialName);
					this.clientDataForm.controls['commercialRecord'].setValue(data.commercialRecord);
					this.clientDataForm.controls['taxCardNum'].setValue(data.taxCardNum);
					this.clientDataForm.controls['vatTaxNum'].setValue(data.vatTaxNum);
					this.clientDataForm.controls['withHoldTax'].setValue(data.withHoldTax);
					this.clientDataForm.controls['isVatTaxActive'].setValue(data.isVatTaxActive);
					this.clientDataForm.controls['isWithHoldTaxActive'].setValue(data.isWithHoldTaxActive);
					this.clientDataForm.controls['clientCategory_Id'].setValue(data.clientCategory_Id);
					this.clientDataForm.controls['activity'].setValue(data.activity);
					this.clientDataForm.controls['isActive'].setValue(data.isActive);

					this.fillDropDowns();
				}
			)

		});
		

	}


	Submit(clientDataForm: any) {
		if (this.clientDataForm.valid) {

				this.service.UpdateClientData(clientDataForm).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						this.service.bSubject.next(true);
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					});

		}

	}



}