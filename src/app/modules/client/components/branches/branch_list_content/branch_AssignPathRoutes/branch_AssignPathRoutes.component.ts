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
import { IBranchAddModel } from "../../../../models/IBranchUpsert.interface";
import { ClientBranchService } from "../../../../services/branch.service";
import { PathrouteService } from "src/app/modules/declarations/services/pathroute.service";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { TechnicianService } from "src/app/core-module/LookupsServices/technician.service";
import { IclientBranchAssignPathModel } from "src/app/modules/client/models/IclientBranchAssignPathModel.interface";

@Component({
	selector: "branch-assign-path",
	templateUrl: './branch_AssignPathRoutes.component.html',
	styleUrls: ['./branch_AssignPathRoutes.component.scss']
})

export class BranchAssignPathComponent implements OnInit {

	branch: IBranchAddModel;
	branchId: number;
	companyBranchId: number;
	isEditable: boolean = false;

	dropdownPathRouteData: LookUpModel[] = [];


	submitClicked: boolean = false;
	AssignPathToClientDataForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private pathrouteService: PathrouteService,
		private service: ClientBranchService,
		private auth: AuthService
	) { }

	ngOnInit() {
		this.setDefaultForForm();
		this.initForm();
	}

	setDefaultForForm() {
		this.AssignPathToClientDataForm = this.fb.group({
			PathRouteId: [,Validators.compose([Validators.required])],
		});
	}


	fillDropDowns() {

		this.dropdownPathRouteData = [];

		this.auth.userData.subscribe((data: IUserData) => {
			this.companyBranchId = data.branchId;

			this.pathrouteService.getLookUpPathRoute({ CompanyBranchId: data.branchId }).subscribe((data: LookUpModel[]) => {
				this.dropdownPathRouteData = data;
			});

		});
	}

	// initialize Form With Validations
	initForm() {
	  this.fillDropDowns();
	}


	Submit(model: IclientBranchAssignPathModel) {

		if (this.AssignPathToClientDataForm.valid) {

				model.ClientBranchId = this.data.branchId;

				this.service.AssignPathRouteToClientBranch(model).
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

	}



}