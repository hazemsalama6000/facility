import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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


	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private service: TechnitianService,
		private toaster: toasterService,
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<AddTechnitianLogComponent>) { }

	ngOnInit(): void {
		this.AddTechnicianForm = this.fb.group({
			employeeId: [this.data.employeeId],
			useGps: [false],
			returnFromBill: [false]
		});
	}

	saveTechnitian(model: ITechnitianLog) {
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