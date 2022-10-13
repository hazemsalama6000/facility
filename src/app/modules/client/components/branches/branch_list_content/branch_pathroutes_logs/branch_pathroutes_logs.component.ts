import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";

import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IBranchAddModel } from "../../../../models/IBranchUpsert.interface";
import { ClientBranchService } from "../../../../services/branch.service";
import { PathrouteService } from "src/app/modules/declarations/services/pathroute.service";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { TechnicianService } from "src/app/core-module/LookupsServices/technician.service";
import { IclientBranchAssignPathModel } from "src/app/modules/client/models/IclientBranchAssignPathModel.interface";
import { IBranchPathRoutesLogs } from "src/app/modules/client/models/IBranchPathRoutesLogs.interface";

@Component({
	selector: "branch-assign-path",
	templateUrl: './branch_pathroutes_logs.component.html',
	styleUrls: ['./branch_pathroutes_logs.component.scss']
})

export class BranchPathRoutesLogs implements OnInit {

	dropdownPathRouteData: LookUpModel[] = [];

	submitClicked: boolean = false;
	AssignPathToClientDataForm: FormGroup;
	branchPathRoutesLogs:IBranchPathRoutesLogs[]=[]
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private toaster: toasterService,
		private pathrouteService: PathrouteService,
		private service: ClientBranchService,
		private auth: AuthService
	) { }

	ngOnInit() {
		this.getData();
	}

	getData(){
		this.service.getPathRoutesLogs(this.data.branchId).subscribe((data:IBranchPathRoutesLogs[])=>{
			this.branchPathRoutesLogs=data;
		})
	}


}