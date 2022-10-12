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
import { IBranchAddModel } from "../../../models/IBranchUpsert.interface";
import { ClientBranchService } from "../../../services/branch.service";
import { PathrouteService } from "src/app/modules/declarations/services/pathroute.service";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { TechnicianService } from "src/app/core-module/LookupsServices/technician.service";

@Component({
	selector: "branch-upsert",
	templateUrl: './branch-upsert.component.html',
	styleUrls: ['./branch-upsert.component.scss']
})

export class BranchUpsertComponent implements OnInit {

	branch: IBranchAddModel;
	branchId: number;
	companyBranchId: number;
	isEditable: boolean = false;
	dropdownListDataForState: any = [];
	selectedItemState: any = [];
	dropdownPathRouteData: LookUpModel[] = [];

	dropdownTechnicianData: LookUpModel[] = [];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];

	submitClicked: boolean = false;
	branchDataForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private stateService: StatesService,
		private regionService: RegionService,
		private pathrouteService: PathrouteService,
		private technicianService: TechnicianService,
		private service: ClientBranchService,
		private auth: AuthService
	) { }

	ngOnInit() {
		this.setDefaultForForm();
		this.initForm();
	}

	setDefaultForForm() {
		this.branchDataForm = this.fb.group({
			id: [0],
			clientData_Id: [0],
			name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			responsibleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			commercialName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],

			address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			state_Id: [, Validators.compose([Validators.required])],
			region_Id: [, Validators.compose([Validators.required])],
			pathRoute_Id: [],
			technician_Id: [],

			isCompletedData: [false,],
			isMain: [false,],

			telephone: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[0-9]*$")])],
			mobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
			secondMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],
			managerMobile: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])],

		});
	}


	fillDropDowns() {

		this.dropdownListDataForRegion = [];
		this.auth.userData.subscribe((data: IUserData) => {
			this.companyBranchId = data.branchId;
			this.pathrouteService.getLookUpPathRoute({ CompanyBranchId: data.branchId }).subscribe((data: LookUpModel[]) => {
				this.dropdownPathRouteData = data;
			});

			this.technicianService.getLookUpTechnician(data.branchId).subscribe(
				(res: LookUpModel[]) => this.dropdownTechnicianData = res,
				(err: any) => console.log(err),
				() => { });

		});

		this.stateService.getLookupData().subscribe(
			(data: LookUpModel[]) => {
				this.dropdownListDataForState = data;
			}
		);

		if (this.data.branchId != 0) { // in Edit State
			//get selected region
			this.regionService.getLookupData(this.branch.state_Id).subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);
		}


		setTimeout(() => {
			if (this.data.branchId != 0) {
				this.passingCompanyToFormData();
			}
		}, 1000);

	}

	onItemSelectState(item: any) {

		this.regionService.getLookupData(item.Id).subscribe(
			(data: IRegion[]) => {
				this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
			}
		);

		this.selectedItemForRegion = {};
		this.branchDataForm.controls['region_Id'].setValue(this.selectedItemForRegion);

	}



	passingCompanyToFormData() {

		/*	this.branchDataForm.controls['id'].setValue(this.branch.id);
			this.branchDataForm.controls['company_Id'].setValue(this.branch.company_Id);
			this.branchDataForm.controls['branchName'].setValue(this.branch.branchName);
			this.branchDataForm.controls['branchManager_Id'].setValue(this.branch.branchManager_Id);
			this.branchDataForm.controls['branchAddress'].setValue(this.branch.branchAddress);
			this.branchDataForm.controls['phoneNumber'].setValue(this.branch.phoneNumber);
			this.branchDataForm.controls['state_Id'].setValue(this.branch.stateId);
			this.branchDataForm.controls['region_Id'].setValue(this.branch.region_Id);
			this.branchDataForm.controls['isActive'].setValue(this.branch.isActive);
			this.branchDataForm.controls['isMain'].setValue(this.branch.isMain);
			this.branchDataForm.controls['email'].setValue(this.branch.email);
	*/
		this.branchDataForm.setValue(this.branch);
	}


	// initialize Form With Validations
	initForm() {

		if (this.data.branchId != 0) {
			
			this.auth.userData.subscribe((data: IUserData) => {
				this.companyBranchId = data.branchId;
				
				this.service.getBranchDataById(this.data.branchId, this.companyBranchId).subscribe(
					(data: IBranchAddModel) => {
						this.branch = data;
						this.fillDropDowns();
					}
				)
			});
	
		}
		else {
			this.fillDropDowns();
		}

	}


	Submit(model: IBranchAddModel) {


		if (this.branchDataForm.valid) {

			if (model.id == 0) {
				model.clientData_Id = this.data.clientId;
				this.service.PostBranchData(model).
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
				/*this.service.UpdateBranchData(model).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						this.service.bSubject.next(true);
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					});*/

			}

		}

	}



}