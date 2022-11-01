import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { FcmConfig } from "../../../models/fcmconfig/FcmConfig";
import { FcmConfigService } from "../../../services/notiFcmConfig.service";
import { fcmConfigAddDialogComponent } from "../fcmConfig-AddDialog/fcmConfigAddDialog.Component";

@Component({
    selector:'app-fcmconfigupset',
    templateUrl:'./fcmconfig-upset.component.html'
})
export class fcmconfigupset implements OnInit{

	messageErrors: string;

	toggleAddEditButton: boolean;

	UpsertForm: FormGroup;

	userdata: IUserData;

	private unsubscribe: Subscription[] = [];

    @Input() set Editmodel(value: any) {
		if (value) {
			//	this.UpsertForm.setValue(value);
		}
	}

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: FcmConfigService, private auth: AuthService,private dialog: MatDialog){}

	ngOnInit(): void {
		this.messageErrors = "";
		this.toggleAddEditButton = true;

		const udata = this.auth.userData.subscribe(res => this.userdata = res);
		this.unsubscribe.push(udata);
	}
	
	addNewRow() {
		this.dialog.open(fcmConfigAddDialogComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%' });
	}
	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
	Submit(model: FcmConfig) {}
}