import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { dropdownSettings } from "src/app/core-module/UIServices/dropdownsetting";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ChangeDetectorRef } from '@angular/core';
import { IClientForm } from "src/app/modules/client/models/IClientForm.interface";
import { ClientService } from "src/app/modules/client/services/client.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { IClientUpsertModel } from "src/app/modules/client/models/IClientUpsertModel.interface";

@Component({
	selector: "client-upsert",
	templateUrl: './client-upsert.component.html',
	styleUrls: ['./client-upsert.component.scss']
})

export class ClientUpsertComponent implements OnInit {

	saveButtonClickedFlag = false;

	isEdit = false;
	client: IClientForm;

	isEditable: boolean = false;
	dropdownListDataForState: any = [];
	selectedItemState: any = [];
	
	dropdownCategoryData:any=[];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];



	dropdownSettings = dropdownSettings;

	panelOpenState: boolean = true;

	clientDataForm: FormGroup;
	companyBranch:number;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private stateService: StatesService,
		private regionService: RegionService,
		private service: ClientService,
		private employeeService: EmployeeService,
		private rcd: ChangeDetectorRef,
		private auth:AuthService
	) {

		//here get data of company and put data in the form

	}
	setDefaultForForm() {

		if (this.data.clientId != 0) {  //for edit
			this.isEdit = true;
			this.clientDataForm = this.fb.group({
				id: [0],
				Code: ['', Validators.compose([Validators.required, Validators.min(0) , Validators.minLength(3), Validators.maxLength(100),Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				CommercialName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				responsibleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				
				taxCardNum: [, Validators.compose([Validators.required,Validators.min(0) ,Validators.minLength(9),  Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				vatTaxNum: [, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				withHoldTax: [, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],

				
				isVatTaxActive: [false,],
				isWithHoldTaxActive: [false,],
				isAddedClientBranch: [false,],

				clientCategory_Id: [, Validators.compose([Validators.required])],
				address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

				telephone: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				secondMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				managerMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],

				activity: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: [, Validators.compose([Validators.required])],
				region_Id: [, Validators.compose([Validators.required])],
				
		        isActive: [false,],
				isMain: [false,]
			});
		}


		else {  // for add
			this.isEdit = false;
			this.clientDataForm = this.fb.group({
				id: [0],
				Code: ['', Validators.compose([Validators.required, Validators.min(0) , Validators.minLength(3), Validators.maxLength(100),Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				CommercialName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				responsibleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				
				taxCardNum: [, Validators.compose([Validators.required,Validators.min(0) ,Validators.minLength(9),  Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				vatTaxNum: [, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				withHoldTax: [, Validators.compose([Validators.minLength(0), Validators.maxLength(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],

				
				isVatTaxActive: [false,],
				isWithHoldTaxActive: [false,],
				isAddedClientBranch: [false,],

				clientCategory_Id: [, Validators.compose([Validators.required])],
				address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

				telephone: ['', Validators.compose([ Validators.required,Validators.minLength(7), Validators.maxLength(7), Validators.pattern("^[0-9]*$")])],
				mobile: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				secondMobile: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				managerMobile: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],

				activity: ['', Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: [, Validators.compose([Validators.required])],
				region_Id: [, Validators.compose([Validators.required])],
				isActive: [false,],
				isMain: [false,]

			});

		}



	}


	fillDropDowns() {
		this.stateService.getLookupData().subscribe(
			(data: LookUpModel[]) => {
				this.dropdownListDataForState = data;
			}
		);
		this.auth.userData.subscribe((data: IUserData) => {

			this.companyBranch = data.branchId;
			this.service.getClientCategories(data.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCategoryData = data;
				}
			);

		});

		this.dropdownListDataForState = this.stateService.states;

		this.dropdownListDataForRegion = [];


		if (this.isEdit) {

			//get selected region
			this.regionService.getLookupData(this.client.state_Id).subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

		
			setTimeout(() => {
			//	this.passingCompanyToFormData();
			}, 1000);

		}

	}


	ngOnInit() {

		this.setDefaultForForm();

		this.initForm();

	}

	onItemSelectState(item: any) {
		this.regionService.getLookupData(item.Id).subscribe(
			(data: IRegion[]) => {
				this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
			}
		);
		this.selectedItemForRegion = {};

	}


	// initialize Form With Validations
	initForm() {

		this.client = {} as IClientForm;

//TODO
	/*	if (this.isEdit) {

			this.service.getCompanyDataById(this.data.companyId).subscribe(
				(data: ICompany) => {
					this.client = data;
					this.isEdit = true;
					this.fillDropDowns();
				}
			)
		} else {*/
			this.fillDropDowns();
		/*}*/

	}

	mapFormGroupsToModel(companyDataForm: IClientForm): IClientUpsertModel {

		// console.log(companyDataForm);
		let model: IClientUpsertModel = {} as IClientUpsertModel;

		model.id = companyDataForm.id;
		model.name = companyDataForm.name;

		model.clientDataCode = companyDataForm.Code;
		model.clientCommercialName = companyDataForm.CommercialName;
		model.activity = companyDataForm.activity;
		model.commercialRecord = companyDataForm.commercialRecord;
		model.taxCardNum = companyDataForm.taxCardNum;
		model.vatTaxNum = companyDataForm.vatTaxNum;
		model.vatTax = companyDataForm.vatTax;
		model.isVatTaxActive = companyDataForm.isVatTaxActive;
		model.withHoldTax = companyDataForm.withHoldTax;
		model.isWithHoldTaxActive = companyDataForm.isWithHoldTaxActive;
		model.isAddedClientBranch = companyDataForm.isAddedClientBranch;
		model.clientCategory_Id = companyDataForm.clientCategory_Id;
		model.companyBranch_Id = this.companyBranch;
		model.clientCommercialName = companyDataForm.CommercialName;


	model.clientDataBranches=[{
        name: companyDataForm.name,
        clientBranchCode: companyDataForm.Code,
        address: companyDataForm.address,
        telephone: companyDataForm.telephone,
        mobile: companyDataForm.mobile,
        secondMobile: companyDataForm.secondMobile,
        managerMobile: companyDataForm.managerMobile,
        region_Id: companyDataForm.region_Id,
        responsibleName: companyDataForm.responsibleName,
        commercialName: companyDataForm.CommercialName,
        isActive: true,
        clientBranchId: this.companyBranch
	}];
	
		return model;

	}


	Submit(clientDataForm: any) {
		if (this.clientDataForm.valid) {

			let model: IClientUpsertModel[] = [this.mapFormGroupsToModel(clientDataForm)];

			this.isEditable = true;

			if (clientDataForm.id == 0) {

				this.service.PostClientData(model).
					subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								// console.log(data.message);
								document.getElementById("closeme")?.click();
								this.service.bSubject.next(true);
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



}