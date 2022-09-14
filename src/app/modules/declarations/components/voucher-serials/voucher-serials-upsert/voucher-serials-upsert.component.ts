import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { DatePipe } from "@angular/common";
import { VoucherSerialService } from "../../../services/voucherSerial.service";
import { FinancialyearService } from "../../../services/financialyear.service";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { IFinancialYear } from "../../../models/IFinancialYear.interface";
import { map } from "rxjs";

@Component({
	selector: "voucher-serials-upsert",
	templateUrl: './voucher-serials-upsert.component.html',
	styleUrls: ['./voucher-serials-upsert.component.scss']
})

export class VoucherSerialUpsertComponent implements OnInit {

	saveButtonClickedFlag = false;
	branchId: number;
	companyId:number;
	isEdit = false;
	

	dropdownFinancialYearData: LookUpModel[] = [];
	dropdownBillTypeData: LookUpModel[] = [];
	dropdownEmloyeeTypeData: LookUpModel[] = [];

	panelOpenState: boolean = true;

	voucherSerialDataForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private toaster: toasterService,
		private auth: AuthService,
		private voucherSerialService: VoucherSerialService,	private financialYearService: FinancialyearService,
		private employeeService: EmployeeService,
		 private datePipe: DatePipe
	) { }


	setDefaultForForm() {
		this.voucherSerialDataForm = this.fb.group({
			financialYear_Id: [, Validators.compose([Validators.required])],
			billType_Id: [, Validators.compose([Validators.required])],
			technician_Id: [, Validators.compose([Validators.required])],
			fromSerial: [0, Validators.compose([ Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$"),Validators.required])],
			toSerial: [0, Validators.compose([ Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$"),Validators.required])]
		});
	}


	fillDropDowns() {

		this.auth.userData.subscribe((data: IUserData) => {

			this.branchId = data.branchId;
			this.companyId = data.companyId;

			this.employeeService.getLookupEmployeeData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownEmloyeeTypeData = data;
			});

			this.financialYearService.GetActiveFinancialYear(data.companyId)
				.pipe(map((data: IFinancialYear[]) => { return data.map((dataa: IFinancialYear) => { return { Id: dataa.id, Name: dataa.year } as LookUpModel }) })).subscribe((data: LookUpModel[]) => {
					this.dropdownFinancialYearData = data;
				});

			this.voucherSerialService.getLookupBillsTypesData().subscribe((data: LookUpModel[]) => {
				this.dropdownBillTypeData = data;
			});

		});
	}


	ngOnInit() {

		this.setDefaultForForm();
		this.fillDropDowns();

	}

	
	Submit(voucherSerialDataForm: any) {

		console.log(voucherSerialDataForm);
		voucherSerialDataForm.company_Id=this.companyId;
		if (this.voucherSerialDataForm.valid) {

	
			this.voucherSerialService.PostVoucherSerialData(voucherSerialDataForm).
				subscribe(
					(data: HttpReponseModel) => {
						this.toaster.openSuccessSnackBar(data.message);

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
							this.voucherSerialService.searchUpdateUserManageAction.next(true);

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