import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { dropdownSettings } from "src/app/core-module/UIServices/dropdownsetting";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { ICompany } from "src/app/modules/hr/models/ICompany";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { AuthService } from "../../auth";
import { IUserData } from "../../auth/models/IUserData.interface";
import { DepartmentService } from "../../share/Services/department_section/department.service";
import { SectionService } from "../../share/Services/department_section/section.service";
import { JobService } from "../../share/Services/job.service";
import { MaritalStatusService } from "../../share/Services/maritalStatus.service";
import { MilitaryStatusService } from "../../share/Services/militaryStatus.service";
import { IEmployeeForm } from "../models/IEmployeeForm.interface";

@Component({
	selector: "employee-upsert",
	templateUrl: './employee-upsert.component.html',
	styleUrls: ['./employee-upsert.component.scss']
})

export class EmployeeUpsertComponent implements OnInit {

	saveButtonClickedFlag = false;

	isEdit = false;
	employee: IEmployeeForm;
	ImageFile: File;
	isEditable: boolean = false;

	dropdownListDataForMilitary: any = [];
	dropdownListDataForMarital: any = [];
	dropdownListDataForDepartment:any=[];
	dropdownListDataForSecion:any=[];
	dropdownListDataForJobs:any=[];

	dropdownListDataForState: any = [];
	selectedItemState: any = [];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];

	selectedItemForEmployee: any = [];

	dropdownListDataForResponsible: any = [];
	selectedItemForResponsible: any = [];

	dropdownSettings = dropdownSettings;

	panelOpenState: boolean = true;

	EmployeeDataForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private stateService: StatesService,
		private maritalStateService:MaritalStatusService,
		private militaryStateService:MilitaryStatusService,
		private regionService: RegionService,
		private departmentService:DepartmentService,
		private sectionService:SectionService,
		private jobService:JobService,
		private service: CompanyService,
		private authService:AuthService
	) {

		//here get data of company and put data in the form

	}
	setDefaultForForm() {

		if (this.data.employeeId != 0) {  //for edit
			this.isEdit = true;
			this.EmployeeDataForm = this.fb.group({
				id: [0],
				Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: ['', Validators.compose([Validators.required])],
				Region_Id: ['', Validators.compose([Validators.required])],
				MilitaryStatus_Id: ['', Validators.compose([Validators.required])],
				JobSection_Id: ['', Validators.compose([Validators.required])],
				MaritalStatus_Id: ['', Validators.compose([Validators.required])],
				BirthDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				NId: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				University: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				Qualification: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				GraduateDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				HireDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				Email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],

			});
		}


		else {  // for add
			this.isEdit = false;
			this.EmployeeDataForm = this.fb.group({
				id: [0],
				Image:[''],
				Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: ['', Validators.compose([Validators.required])],
				Region_Id: ['', Validators.compose([Validators.required])],
				MilitaryStatus_Id: ['', Validators.compose([Validators.required])],
				JobSection_Id: ['', Validators.compose([Validators.required])],
				MaritalStatus_Id: ['', Validators.compose([Validators.required])],
				BirthDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				NId: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				University: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				Qualification: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				GraduateDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				HireDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				Email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
			});

		}



	}


	fillDropDowns() {


		this.militaryStateService.getLookupData().subscribe((data:LookUpModel[])=>{
			this.dropdownListDataForMilitary=data;
		});

		this.maritalStateService.getLookupData().subscribe((data:LookUpModel[])=>{
			this.dropdownListDataForMarital=data;
		});

		this.stateService.getLookupData().subscribe((data:LookUpModel[])=>{
			this.dropdownListDataForState=data;
		});

		this.authService.userData.subscribe((data:IUserData)=>{
			this.departmentService.getLookupData(data.companyId).subscribe((data:LookUpModel[])=>{
				this.dropdownListDataForDepartment=data;
			});
		});
	

		this.dropdownListDataForRegion = [];


		if (this.isEdit) {

			//get selected region
			this.regionService.getLookupData(this.employee.state_Id).subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

/*
			setTimeout(() => {
				this.passingCompanyToFormData();
			}, 1000);*/

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
		this.EmployeeDataForm.controls['region_Id'].setValue(this.selectedItemForRegion);

	}



	/*passingCompanyToFormData() {

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
*/
	// initialize Form With Validations
	initForm() {

		this.employee = {
			Name: '',
			id: 0,
			Code: '',
			Address: '',
			state_Id: 0,
			Region_Id: 0,
			Image: '', Mobile: '0',
			Email: '', BirthDate: '',
			NId: '', MilitaryStatus_Id: 0, MaritalStatus_Id: 0,
			University: '',
			Qualification: '',
			GraduateDate: '',
			JobSection_Id: 0,
			HireDate: '',
			Branch_Id: 0,
			IsTechnician: false
		} as IEmployeeForm;


	/*	if (this.isEdit) {

			this.service.getCompanyDataById(this.data.employeeId).subscribe(
				(data: ICompany) => {
					this.company = data;
					this.isEdit = true;
					this.fillDropDowns();
				}
			)
		} else {*/
			this.fillDropDowns();
		/*}*/



	}

	ImageChange(event: any) {
		this.ImageFile = <File>event.target.files[0];
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

		if (companyDataForm.isValTaxActive == false) {
			model.vatTax = 0;
		}
		if (companyDataForm.isWTaxActive == false) {
			model.wTax = 0;
		}

		model.hasDirectTransferForStocks = companyDataForm.hasDirectTransferForStocks;

		return model;

	}


	Submit(companyDataForm: any) {

		if (this.EmployeeDataForm.valid) {

			let model: ICompany = this.mapFormGroupsToModel(companyDataForm);

			this.isEditable = true;

			if (companyDataForm.id == 0) {

				const fd = new FormData();

				fd.append('logoWebPhoto', this.ImageFile, this.ImageFile.name);

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