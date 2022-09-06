import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DialogPosition, MatDialog } from "@angular/material/dialog";

import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { VoucherSerialService } from "../../services/voucherSerial.service";
import { FinancialyearService } from "../../services/financialyear.service";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { IVoucherSerialSearch } from '../../models/voucher-serials/IVoucherSerialSearch.interface'
import { map } from "rxjs";
import { IFinancialYear } from "../../models/IFinancialYear.interface";
import { VoucherSerialUpsertComponent } from "./voucher-serials-upsert/voucher-serials-upsert.component";

@Component({
	selector: 'voucher-serials',
	templateUrl: './voucher-serials.component.html',
	styleUrls: ['./voucher-serials.component.scss'],
})

export class VoucherSerialsComponent implements OnInit {

	dropdownFinancialYearData: LookUpModel[] = [];
	dropdownBillTypeData: LookUpModel[] = [];
	dropdownEmloyeeTypeData: LookUpModel[] = [];

	VoucherSerialsSearchForm: FormGroup;
	searchModel: IVoucherSerialSearch = {} as IVoucherSerialSearch;

	branchId: number;
	companyId: number;

	constructor(
		private voucherSerialService: VoucherSerialService,
		private financialYearService: FinancialyearService,
		private employeeService: EmployeeService,
		private toaster: toasterService, private fb: FormBuilder,
		private auth: AuthService, private datePipe: DatePipe,
		private dialog: MatDialog) {
	}

	ngOnInit(): void {

		this.VoucherSerialsSearchForm = this.fb.group({
			FinancialYearId: [],
			BillTypeId: [],
			EmployeeId: []
		});

		this.auth.userData.subscribe((data: IUserData) => {

			this.branchId = data.branchId;
			this.companyId = data.companyId;

			this.employeeService.getLookupEmployeeData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownEmloyeeTypeData = data;
			});

			this.financialYearService.GetFinancialYear(data.companyId)
				.pipe(map((data: IFinancialYear[]) => { return data.map((dataa: IFinancialYear) => { return { Id: dataa.id, Name: dataa.year } as LookUpModel }) })).subscribe((data: LookUpModel[]) => {
					this.dropdownFinancialYearData = data;
				});

			this.voucherSerialService.getLookupBillsTypesData().subscribe((data: LookUpModel[]) => {
				this.dropdownBillTypeData = data;
			});

		});

	}


	searchVoucherSerial(model: IVoucherSerialSearch) {

		model.CompanyId = this.companyId;

		this.voucherSerialService.searchParameterAction.next(model);
		this.voucherSerialService.searchUpdateUserManageAction.next(true);
	}



	openDialogAddingTransactionVoucherSerial() {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(VoucherSerialUpsertComponent,
			{
				maxHeight: '100vh',
				height: '100%',
				position: dialogPosition
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

}