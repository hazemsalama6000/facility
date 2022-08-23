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

@Component({
	selector: "company-upsert",
	templateUrl: './companys-upsert.component.html',
	styleUrls: ['./company-upsert.component.scss']
})

export class CompanyUpsertComponent implements OnInit {

	saveButtonClickedFlag = false;

	isEdit = false;
	company: ICompany;
	logoWebFile: File;
	logoPrintFile: File;
	isEditable: boolean = false;
	dropdownListDataForState: any = [];
	selectedItemState: any = [];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];

	dropdownListDataForEmployee: LookUpModel[] = [];
	selectedItemForEmployee: any = [];

	dropdownListDataForResponsible: any = [];
	selectedItemForResponsible: any = [];

	dropdownSettings = dropdownSettings;

	panelOpenState: boolean = true;

	companyDataForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private stateService: StatesService,
		private regionService: RegionService,
		private service: CompanyService,
		private employeeService: EmployeeService,
		private rcd: ChangeDetectorRef
	) {

		//here get data of company and put data in the form

	}
	setDefaultForForm() {

		if (this.data.companyId != 0) {  //for edit
			this.isEdit = true;
			this.companyDataForm = this.fb.group({
				id: [0],
				code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				companyName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				activity: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				mobileUsersCount: [, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
				state_Id: ['', Validators.compose([Validators.required])],
				region_Id: ['', Validators.compose([Validators.required])],
				isActive: [false,],
				phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
				employee_Id: ['', Validators.compose([Validators.required])],
				commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				taxCardNo: ['', Validators.compose([Validators.required,  Validators.minLength(3), Validators.maxLength(50)])],
				vatTax: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				isValTaxActive: [false,],
				hasDirectTransferForStocks: [false,],
				wTax: [0, Validators.compose([Validators.min(0), Validators.max(100),Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				isWTaxActive: [false,],
			});
		}


		else {  // for add
			this.isEdit = false;
			this.companyDataForm = this.fb.group({
				id: [0],
				code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				companyName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				activity: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				mobileUsersCount: [0, Validators.compose([Validators.required, Validators.pattern("^[1-9][0-9]*$")])],
				state_Id: ['', Validators.compose([Validators.required])],
				region_Id: ['', Validators.compose([Validators.required])],
				isActive: [false,],
				logoPrint: ['', Validators.compose([Validators.required])],
				logoWeb: ['', Validators.compose([Validators.required])],
				phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
				managerName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				managerPosition: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				commercialRecord: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				taxCardNo: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
				vatTax: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				isValTaxActive: [false,],
				hasDirectTransferForStocks: [false,],
				wTax: [0, Validators.compose([Validators.min(0), Validators.max(100),Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
				isWTaxActive: [false,],
			});

		}



	}


	fillDropDowns() {


		this.dropdownListDataForState = this.stateService.states;
		this.dropdownListDataForEmployee = this.employeeService.employees;


		this.dropdownListDataForRegion = [];


		if (this.isEdit) {

			//get selected region
			this.regionService.getLookupData(this.company.state_Id).subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

			//get selected employee
			this.employeeService.getLookupEmployeeData(this.company.id).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownListDataForEmployee = data.map(item => ({ Id: item.Id, Name: item.Name }) as LookUpModel)
				}
			);

			setTimeout(() => {
				this.passingCompanyToFormData();
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
		this.companyDataForm.controls['region_Id'].setValue(this.selectedItemForRegion);

	}



	passingCompanyToFormData() {

		this.companyDataForm.controls['id'].setValue(this.company.id);
		this.companyDataForm.controls['code'].setValue(this.company.code);
		this.companyDataForm.controls['code'].disable();
		this.companyDataForm.controls['companyName'].setValue(this.company.companyName);
		this.companyDataForm.controls['activity'].setValue(this.company.activity);
		this.companyDataForm.controls['address'].setValue(this.company.address);
		this.companyDataForm.controls['mobileUsersCount'].setValue(this.company.mobileUsersCount);

		this.companyDataForm.controls['state_Id'].setValue(this.company.state_Id);
		this.companyDataForm.controls['region_Id'].setValue(this.company.region_Id);

		this.companyDataForm.controls['isActive'].setValue(this.company.isActive);

		this.companyDataForm.controls['phoneNumber'].setValue(this.company.phoneNumber);
		this.companyDataForm.controls['email'].setValue(this.company.email);
		this.companyDataForm.controls['employee_Id'].setValue(this.company.employee_Id);

		this.companyDataForm.controls['commercialRecord'].setValue(this.company.commercialRecord);
		this.companyDataForm.controls['taxCardNo'].setValue(this.company.taxCardNo);
		this.companyDataForm.controls['vatTax'].setValue(this.company.vatTax);
		this.companyDataForm.controls['isValTaxActive'].setValue(this.company.isValTaxActive);
		this.companyDataForm.controls['hasDirectTransferForStocks'].setValue(this.company.hasDirectTransferForStocks);
		this.companyDataForm.controls['wTax'].setValue(this.company.wTax);
		this.companyDataForm.controls['isWTaxActive'].setValue(this.company.isWTaxActive);

	}

	// initialize Form With Validations
	initForm() {

		this.company = {companyServiceName:'',
			id: 0, code: '', companyName: '', activity: '', address: '', mobileUsersCount: 0, region_Id: 0, isActive: false, logoPrint: '',
			logoWeb: '', phoneNumber: '0', email: '', managerName: '', managerPosition: '', commercialRecord: '', taxCardNo: '', vatTax: '',
			isValTaxActive: false, hasDirectTransferForStocks: false, wTax: '', state_Id: 0, isWTaxActive: false, taxFileNo: '', vatTaxNum: '', employee_Id: 0
		};


		if (this.isEdit) {

			this.service.getCompanyDataById(this.data.companyId).subscribe(
				(data: ICompany) => {
					this.company = data;
					this.isEdit = true;
					this.fillDropDowns();
				}
			)
		} else {
			this.fillDropDowns();
		}



	}

	logoPrintChange(event: any) {
		this.logoPrintFile = <File>event.target.files[0];
	}

	logoWebChange(event: any) {
		this.logoWebFile = <File>event.target.files[0];
	}


	mapFormGroupsToModel(companyDataForm: any): ICompany {

		// console.log(companyDataForm);
		let model: any = {};

		model.id = companyDataForm.id;
		model.code = companyDataForm.code;
		model.companyName = companyDataForm.companyName;
		model.activity = companyDataForm.activity;
		model.address = companyDataForm.address;
		model.mobileUsersCount = companyDataForm.mobileUsersCount;
		model.region_Id = companyDataForm.region_Id;
		model.isActive = companyDataForm.isActive;

		model.phoneNumber = companyDataForm.phoneNumber;
		model.email = companyDataForm.email;

		if (model.id) {
			model.employee_Id = companyDataForm.employee_Id
		}
		else {
			model.managerName = companyDataForm.managerName;
			model.managerPosition = companyDataForm.managerPosition;
		}

		model.commercialRecord = companyDataForm.commercialRecord;
		model.taxCardNo = companyDataForm.taxCardNo;
	
		model.wTax = companyDataForm.wTax;
		model.vatTax = companyDataForm.vatTax;
		model.isValTaxActive = companyDataForm.isValTaxActive;
		model.isWTaxActive = companyDataForm.isWTaxActive;
		
		if(companyDataForm.isValTaxActive == false){
			model.vatTax = 0;
		}
		if(companyDataForm.isWTaxActive == false){
			model.wTax = 0;
		}

		model.hasDirectTransferForStocks = companyDataForm.hasDirectTransferForStocks;

		return model;

	}


	Submit(companyDataForm: any) {

		if (this.companyDataForm.valid) {

			let model: ICompany = this.mapFormGroupsToModel(companyDataForm);

			this.isEditable = true;

			if (companyDataForm.id == 0) {

				const fd = new FormData();

				fd.append('logoPrintPhoto', this.logoPrintFile, this.logoPrintFile.name);
				fd.append('logoWebPhoto', this.logoWebFile, this.logoWebFile.name);

				fd.append('id', model.id.toString());
				fd.append('code', model.code);
				fd.append('companyName', model.companyName);
				fd.append('activity', model.activity);
				fd.append('address', model.address);
				fd.append('mobileUsersCount', model.mobileUsersCount.toString());
				fd.append('region_Id', model.region_Id.toString());
				fd.append('isActive', model.isActive.toString());

				fd.append('phoneNumber', model.phoneNumber);
				fd.append('email', model.email);
				fd.append('managerName', model.managerName);
				fd.append('managerPosition', model.managerPosition);

				fd.append('commercialRecord', model.commercialRecord);
				fd.append('taxCardNo', model.taxCardNo);
				fd.append('wTax', model.wTax.toString());
				fd.append('vatTax', model.vatTax.toString());
				fd.append('isValTaxActive', model.isValTaxActive.toString());
				fd.append('isWTaxActive', model.isWTaxActive.toString());
				fd.append('hasDirectTransferForStocks', model.hasDirectTransferForStocks.toString());


				this.service.PostCompanyData(fd).
					subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								// console.log(data.message);
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

			else {
				this.service.UpdateCompanyData(model).subscribe(
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



}