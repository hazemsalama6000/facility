import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription} from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { TransferingCompanyService } from "../../../services/transferingCompany.service";
import { UnitsService } from "../../../services/unit.service";


interface ClientError {
	code: string;
	description: string;
}

@Component({
	selector: 'units-upsert',
	templateUrl: './units-upsert.component.html',
	styleUrls: ['./units-upsert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush

})

export class UnitsUpsertComponent {

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

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: UnitsService, private auth: AuthService) { }


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

	
	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}