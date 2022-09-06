import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { Subscription} from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { UnitConversionService } from "../../../services/unitconversion.service";
import { UnitConverionPopupComponent } from "./unit-converion-popup/unit-converion-popup.component";


interface ClientError {
	code: string;
	description: string;
}

@Component({
	selector: 'unit-conversion-upsert',
	templateUrl: './unit-conversion-upsert.component.html',
	styleUrls: ['./unit-conversion-upsert.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class UnitConversionUpsertComponent {

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

	constructor(private fb: FormBuilder, private toaster: toasterService, private dialog: MatDialog,private service: UnitConversionService, private auth: AuthService) { }


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
	
	
	
	openDialogAddingUnitConversion() {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(UnitConverionPopupComponent,
			{
				maxHeight: '100vh',
				height: '100%',
				position: dialogPosition
						});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

	// for Insert And Delete distingush them with model.id

	
	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}