import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { ITechnitianLog } from "../../models/ITechnitianLog.interface";
import { TechnitianService } from "../../services/technitian.service";

@Component({
	selector: 'add-technitian',
	templateUrl: './add-technitian-Log.component.html',
	styleUrls: ['./add-technitian-Log.component.scss']
})

export class AddTechnitianLogComponent implements OnInit {

	public AddTechnicianForm: FormGroup;
	saveButtonClickedFlag = false;


	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private service: TechnitianService,
		private toaster: toasterService,
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<AddTechnitianLogComponent>) { }

	ngOnInit(): void {
		this.AddTechnicianForm = this.fb.group({
			employeeId: [this.data.employeeId],
			canCollect: [false],
			canRead: [false],
			canComplain: [false],
			canEditCustomer: [false],
			attachImageRead: [false],
			attachImageEditCustomer: [false],
			maxOfflineWorkingHours: [0, Validators.compose([Validators.min(0), Validators.max(100), Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
			maxOfflineWorkingBills: [0, Validators.compose([Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])]
		});
	}

	saveTechnitian(model: any) {
		
		if (this.AddTechnicianForm.valid) {

			this.service.addTechnicianLog(model).subscribe(
				(data: HttpReponseModel) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.dialogRef.close(model);
				}, (error) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				}
			);

		}
	}

}