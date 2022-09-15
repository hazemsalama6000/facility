import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { tap } from "rxjs";
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
import { ISection } from "../../share/models/ISection.interface";
import { DepartmentService } from "../../share/Services/department_section/department.service";
import { SectionService } from "../../share/Services/department_section/section.service";
import { JobService } from "../../share/Services/job.service";
import { MaritalStatusService } from "../../share/Services/maritalStatus.service";
import { MilitaryStatusService } from "../../share/Services/militaryStatus.service";
import { StatusService } from "../../share/Services/status.service";
import { IEmployee } from "../models/employee.interface";
import { IEmployeeForm } from "../models/IEmployeeForm.interface";
import { EmployeeService } from "../services/employee.service";

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
	dropdownListDataForDepartment: any = [];
	dropdownListDataForSecion: any = [];
	dropdownListDataForJobs: any = [];

	dropdownListDataForState: any = [];
	selectedItemState: any = [];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];

	selectedItemForEmployee: any = [];
	dropdownListDataForStatus: any = [];
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
		private maritalStateService: MaritalStatusService,
		private militaryStateService: MilitaryStatusService,
		private regionService: RegionService,
		private departmentService: DepartmentService,
		private sectionService: SectionService,
		private statusService: StatusService,
		private jobService: JobService,
		private service: EmployeeService,
		private authService: AuthService
	) {
		//here get data of company and put data in the form
	}
	setDefaultForForm() {
		if (this.data.employeeId != 0) {  //for edit
			this.isEdit = true;
			this.EmployeeDataForm = this.fb.group({
				id: [0],
				Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
				Address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: ['', Validators.compose([Validators.required])],
				Region_Id: ['', Validators.compose([Validators.required])],
				MilitaryStatus_Id: ['', Validators.compose([Validators.required])],
				Department_Id: ['', Validators.compose([Validators.required])],
				Section_Id: ['', Validators.compose([Validators.required])],
				Status_Id: [],

				JobSection_Id: ['', Validators.compose([Validators.required])],
				MartialStatus_Id: ['', Validators.compose([Validators.required])],
				BirthDate: ['', Validators.compose([])],
				NId: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				University: ['', Validators.compose([Validators.minLength(14), Validators.maxLength(14)])],
				Qualification: ['', Validators.compose([Validators.minLength(14), Validators.maxLength(14)])],
				GraduateDate: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				HireDate: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				Mobile: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				Email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
				Branch_Id: [],
				IsTechnician: [false]
			});
		}


		else {  // for add
			this.isEdit = false;
			this.EmployeeDataForm = this.fb.group({
				id: [0],
				Image: [''],
				Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
				Address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
				state_Id: [, Validators.compose([Validators.required])],
				Region_Id: [, Validators.compose([Validators.required])],
				MilitaryStatus_Id: [],
				Department_Id: [, Validators.compose([Validators.required])],
				Section_Id: [, Validators.compose([Validators.required])],
				Status_Id: [],
				JobSection_Id: [, Validators.compose([Validators.required])],
				MartialStatus_Id: [],
				BirthDate: [''],
				NId: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
				University: ['', Validators.compose([Validators.minLength(14), Validators.maxLength(14)])],
				Qualification: ['', Validators.compose([Validators.minLength(14), Validators.maxLength(14)])],
				GraduateDate: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				HireDate: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
				Mobile: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
				Email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
				Branch_Id: [],
				IsTechnician: [false]

			});

		}

	}


	fillDropDowns() {


		this.militaryStateService.getLookupData().subscribe((data: LookUpModel[]) => {
			this.dropdownListDataForMilitary = data;
		});

		this.statusService.getLookUpData().subscribe((data: LookUpModel[]) => {
			this.dropdownListDataForStatus = data;
		});

		this.maritalStateService.getLookupData().subscribe((data: LookUpModel[]) => {
			this.dropdownListDataForMarital = data;
		});

		this.stateService.getLookupData().subscribe((data: LookUpModel[]) => {
			this.dropdownListDataForState = data;
		});

		this.authService.userData.subscribe((data: IUserData) => {
			this.departmentService.getLookupData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownListDataForDepartment = data;
			});
		});


		this.dropdownListDataForRegion = [];
		this.dropdownListDataForSecion = [];
		this.dropdownListDataForJobs = [];

		if (this.isEdit) {

			//get selected region
			this.regionService.getLookupData(this.employee.state_Id).subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

			this.sectionService.getLookupData(this.employee.Department_Id).subscribe(
				(data: ISection[]) => {
					this.dropdownListDataForSecion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);
			this.jobService.getListData(this.employee.Section_Id).subscribe(
				(data: any) => {
					this.dropdownListDataForJobs = data.map((item: any) => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

			setTimeout(() => {
				this.EmployeeDataForm.setValue(this.employee);
				//this.passingCompanyToFormData();
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

	}


	onItemSelectDepartment(item: any) {
		this.sectionService.getLookupData(item.Id).subscribe(
			(data: ISection[]) => {
				this.dropdownListDataForSecion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
			}
		);
	}


	onItemSelectSection(item: any) {
		this.jobService.getListData(item.Id).subscribe(
			(data: any) => {
				this.dropdownListDataForJobs = data.map((item: any) => ({ Id: item.id, Name: item.name }) as LookUpModel)
			}
		);
	}



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
			Email: '', BirthDate: '', Status_Id:0,
			NId: '', MilitaryStatus_Id: 0, MartialStatus_Id: 0,

			University: '',
			Qualification: '',
			GraduateDate: '',
			JobSection_Id: 0,
			HireDate: '',
			Branch_Id: 0,
			IsTechnician: false
		} as IEmployeeForm;


		if (this.isEdit) {

			this.service.getEmployeeByIdForUpdate(this.data.employeeId).subscribe(
				(data: IEmployeeForm) => {
					this.employee = data;
					
					console.log(this.employee);

					this.isEdit = true;
					this.fillDropDowns();
				}
			)
		} else {
			this.fillDropDowns();
		}



	}

	ImageChange(event: any) {
		this.ImageFile = <File>event.target.files[0];
	}


	Submit(model: any) {

		if (this.EmployeeDataForm.valid) {

			this.isEditable = true;

			if (model.id == 0) {

				const fd = new FormData();

				if (this.ImageFile != null || this.ImageFile != undefined) {
					fd.append('Image', this.ImageFile, this.ImageFile.name);
				}

				fd.append('id', model.id);
				fd.append('Name', model.Name);

				fd.append('Code', model.Code);
				fd.append('Address', model.Address);
				fd.append('state_Id', model.state_Id);
				fd.append('Region_Id', model.Region_Id);
				fd.append('Mobile', model.Mobile);
				fd.append('Email', model.Email);
				fd.append('BirthDate', model.BirthDate);

				fd.append('NId', model.NId);
				fd.append('MilitaryStatus_Id', model.MilitaryStatus_Id==null?'':model.MilitaryStatus_Id);
				fd.append('Status_Id', model.Status_Id==null?'':model.Status_Id);

				fd.append('MartialStatus_Id', model.MartialStatus_Id==null?'':model.MartialStatus_Id);
				fd.append('University', model.University);

				fd.append('Qualification', model.Qualification);
				fd.append('GraduateDate', model.GraduateDate);
				fd.append('JobSection_Id', model.JobSection_Id);
				fd.append('HireDate', model.HireDate);
				fd.append('Branch_Id', this.data.branch_Id.toString());
				fd.append('IsTechnician', 'false');


				this.service.PostEmployeeData(fd).
					subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								// console.log(data.message);
								this.service.bSubject.next(true);
								document.getElementById('closeme')?.click();
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
				
				this.service.UpdateLookupData(model).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						this.service.bSubject.next(true);
						this.service.subjectEmployeeChanged.next(true);
						document.getElementById('closeme')?.click();
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					});

			}

		}

	}



}