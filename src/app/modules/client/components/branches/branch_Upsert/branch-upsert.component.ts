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
	ImageFile: File;

	dropdownTechnicianData: LookUpModel[] = [];

	dropdownListDataForRegion: any = [];
	selectedItemForRegion: any = [];

	submitClicked: boolean = false;
	branchDataForm: FormGroup;
	imagePath:string;

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
	ImageChange(event: any) {
		this.ImageFile = <File>event.target.files[0];
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

			this.branchDataForm.controls['id'].setValue(this.branch.id);
			this.branchDataForm.controls['clientData_Id'].setValue(this.branch.clientData_Id);
			this.branchDataForm.controls['name'].setValue(this.branch.name);
			this.branchDataForm.controls['code'].setValue(this.branch.code);
			this.branchDataForm.controls['responsibleName'].setValue(this.branch.responsibleName);
			this.branchDataForm.controls['commercialName'].setValue(this.branch.commercialName);
			this.branchDataForm.controls['state_Id'].setValue(this.branch.state_Id);
			this.branchDataForm.controls['region_Id'].setValue(this.branch.region_Id);
			this.branchDataForm.controls['pathRoute_Id'].setValue(this.branch.pathRoute_Id);
			this.branchDataForm.controls['isMain'].setValue(this.branch.isMain);
			this.branchDataForm.controls['technician_Id'].setValue(this.branch.technician_Id);

			this.branchDataForm.controls['isCompletedData'].setValue(this.branch.isCompletedData);
			this.branchDataForm.controls['isMain'].setValue(this.branch.isMain);
			this.branchDataForm.controls['telephone'].setValue(this.branch.telephone);
			this.branchDataForm.controls['mobile'].setValue(this.branch.mobile);
			this.branchDataForm.controls['secondMobile'].setValue(this.branch.secondMobile);
			this.branchDataForm.controls['managerMobile'].setValue(this.branch.managerMobile);
	}


	// initialize Form With Validations
	initForm() {

		if (this.data.branchId != 0) {
			
			this.auth.userData.subscribe((data: IUserData) => {
				this.companyBranchId = data.branchId;
				
				this.service.getBranchDataById(this.data.branchId, this.companyBranchId).subscribe(
					(data: IBranchAddModel[]) => {
						this.branch = data[0];
						this.imagePath=`${localStorage.getItem("companyLink")}${data[0].imagePath}`;
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

								const fd = new FormData();

								if (this.ImageFile != null && this.ImageFile != undefined) {
									fd.append('photos', this.ImageFile, data.data.id + "_" + this.ImageFile.name);
									
									this.service.UploadImagesForBranch(fd).subscribe(
										(data: HttpReponseModel) => {
											this.toaster.openSuccessSnackBar(data.message);
										},
										(error: any) => {
											console.log(error);
											this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
										}
									);
								}


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
				this.service.UpdateBranchData(model).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						        let fdd = new FormData();

								if (this.ImageFile != null && this.ImageFile != undefined) {
									fdd.append('photos', this.ImageFile, model.id + "_" + this.ImageFile.name);
									
									this.service.UploadImagesForBranch(fdd).subscribe(
										(data: HttpReponseModel) => {
											this.toaster.openSuccessSnackBar(data.message);
										},
										(error: any) => {
											console.log(error);
											this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
										}
									);
								}

						this.service.bSubject.next(true);
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					});

			}

		}

	}



}