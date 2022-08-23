import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ComplainService } from "src/app/modules/operations/services/complain.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ComplainTypeService } from "src/app/shared-module/Services/complainType.service";
import { LookupService } from "src/app/shared-module/Services/Lookup.service";


interface ClientError {
	code: string;
	description: string;
}

@Component({
	selector: 'upsert',
	templateUrl: './upsert.component.html',
	styleUrls: ['./upsert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush

})

export class UpsertComponent {

	pageName: string = '';
	messageErrors: string;

	toggleAddEditButton: boolean;

	UpsertForm: FormGroup;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	//setter for binded model to update
	@Input() set Editmodel(value: any) {
		if (value) {
			this.UpsertForm.setValue(value);
			this.toggleAddEditButton = false;
		}
	}

	constructor(
		private fb: FormBuilder,
		private toaster: toasterService,
		private jobService: LookupService,
		private compainTypeService: ComplainTypeService,
		private auth: AuthService,
		private activatedRoute: ActivatedRoute
	) {
		const udata = this.auth.userData.subscribe(res => this.userdata = res);
		this.unsubscribe.push(udata);
	}


	ngOnInit(): void {
		this.messageErrors = "";
		this.toggleAddEditButton = true;
		this.initForm();
		let sub = this.activatedRoute.data.subscribe(v => this.pageName = v.page);
		this.unsubscribe.push(sub);
	}

	// initialize Form With Validations
	initForm() {
		this.UpsertForm = this.fb.group({
			Id: [''],
			Name: ['', Validators.compose([Validators.required])],
			isActive: ['']
		});
	}


	closeEdit() {
		this.toggleAddEditButton = true;
		this.UpsertForm.setValue({ Id: 0, Name: '', isActive: true });
	}

	reset() {
		this.UpsertForm.setValue({ Id: 0, Name: '', isActive: true });
	}

	addNewRow() {
		if (this.pageName == 'jobs') {
			this.jobService.addFlag.next(true);
		} else if (this.pageName == 'compainType') {
			this.compainTypeService.addFlag.next(true);
		}
	}

	// for Insert And Delete distingush them with model.id

	Submit(model: LookUpModel) {

		model.company_Id = this.userdata.companyId;
		model.isActive = true;
		if (model.Id == 0) {
			model.Id = 0;

			if (this.pageName == 'jobs') {
				this.jobService.PostLookupData(model).
					subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								this.jobService.bSubject.next(true);
							}
							else if (data.isExists) {
								this.toaster.openWarningSnackBar(data.message);
							}
							this.messageErrors = "";
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error);
						}
					);
			} else if (this.pageName == 'compainType') {
				this.compainTypeService.PostLookupData(model).
					subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								this.compainTypeService.bSubject.next(true);
							}
							else if (data.isExists) {
								this.toaster.openWarningSnackBar(data.message);
							}
							this.messageErrors = "";
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error);
						}
					);
			}

		}

		else {
			if (this.pageName == 'jobs') {
				this.jobService.UpdateLookupData(model).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						this.jobService.bSubject.next(true);
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error);
					});
			} else if (this.pageName == 'compainType') {
				this.compainTypeService.UpdateLookupData(model).subscribe(
					(data: any) => {
						this.toaster.openSuccessSnackBar(data.message);
						this.compainTypeService.bSubject.next(true);
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error);
					});
			}


		}

	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}


}