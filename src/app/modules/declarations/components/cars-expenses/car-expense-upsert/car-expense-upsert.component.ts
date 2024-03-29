import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription} from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { CarExpenseService } from "../../../services/carexpense.service";
import { TransferingCompanyService } from "../../../services/transferingCompany.service";


interface ClientError {
	code: string;
	description: string;
}

@Component({
	selector: 'cars-expense-upsert',
	templateUrl: './car-expense-upsert.component.html',
	styleUrls: ['./car-expense-upsert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CarExpenseUpsertComponent {

	messageErrors: string;

	toggleAddEditButton: boolean;

	UpsertForm: FormGroup;

	userdata: IUserData;

	private unsubscribe: Subscription[] = [];

	//setter for binded model to update
	@Input() set Editmodel(value: any) {
		if (value) {
			//	this.UpsertForm.setValue(value);
		}
	}

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: CarExpenseService, private auth: AuthService) { }


	ngOnInit(): void {
		this.messageErrors = "";
		this.toggleAddEditButton = true;
		this.initForm();

		const udata = this.auth.userData.subscribe(res => this.userdata = res);
		this.unsubscribe.push(udata);
	}

	// initialize Form With Validations
	initForm() {
		this.UpsertForm = this.fb.group({
			Id: [''],
			Name: ['', Validators.compose([
				Validators.required
			])]
		});
	}


	closeEdit() {
		this.toggleAddEditButton = true;
		this.UpsertForm.setValue({ Id: 0, Name: '' });
	}

	reset() {
		this.UpsertForm.setValue({ Id: 0, Name: '' });
	}
	addNewRow() {
		this.service.addFlag.next(true);
	}

	// for Insert And Delete distingush them with model.id

	Submit(model: LookUpModel) {

		model.company_Id = this.userdata.companyId;

		if (model.Id == 0) {

			model.Id = 0;

			this.service.PostLookupData(model).
				subscribe(
					(data: HttpReponseModel) => {

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
							this.service.bSubject.next(true);
							this.reset();
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

		else {
			this.service.UpdateLookupData(model).subscribe(
				(data: any) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error);
				});

		}

	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}