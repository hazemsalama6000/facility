
import { Component, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { VoucherSerialService } from "../../../services/voucherSerial.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { HttpClient } from "@angular/common/http";
import { map, merge, switchMap } from "rxjs";

import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { IVoucherSerialSearch } from "../../../models/voucher-serials/IVoucherSerialSearch.interface";
import { IVoucherSerialReponse } from "../../../models/voucher-serials/IVoucherSerialReponse.interface";
@Component({
	selector: 'voucher-serials-datatable',
	templateUrl: './voucher-serials-datatablecomponent.html',
	styleUrls: ['./voucher-serials-datatable.component.scss']
})
export class VoucherSerialsDatatableComponent {

	displayedColumns: string[] = [
		'billType',
		'startDate',
		'endDate',
		'fromSerial',
		'toSerial',
		'totalSerials',
		'availableSerials',
		'lastUsedSerial',
		'nextSerial',
		'technicianName',
		'isDeleted'
	];

	data: IVoucherSerialReponse[] = [];
	currentSearchParameter: IVoucherSerialSearch = {} as IVoucherSerialSearch;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@Input() companyId: number;

	constructor(private _httpClient: HttpClient, private service: VoucherSerialService
		, public dialog: MatDialog, private toaster: toasterService, private confirmationDialogService: ConfirmationDialogService) {
		this.currentSearchParameter = { PageNumber: 0, FinancialYearId: 0, EmployeeId: 0, PageSize: 0, CompanyId: this.companyId, BillTypeId: 0 };
	}

	ngAfterViewInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.paginator.page, this.service.searchUpdateUserManageStream$)
			.pipe(
				switchMap(() => {
					this.isLoadingResults = true;
					this.currentSearchParameter.PageNumber = this.paginator.pageIndex + 1;
					this.currentSearchParameter.PageSize = this.paginator.pageSize;

					return this.service.searchVoucherSerial(this.currentSearchParameter);
				}),
				map((data: ItemsWithPages) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalCount;
					return data.data;
				}),
			)
			.subscribe((data) => { this.data = data; });
	}


	dataSource: any;


	ngOnInit(): void {

		this.service.searchParameterStream$.subscribe(
			(data: IVoucherSerialSearch) => {
				this.currentSearchParameter = data;
			}
		);
	}


	removeVoucherSerial(element: IVoucherSerialReponse) {

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ? `)
			.then((confirmed) => {
				if (confirmed) {
					this.service.DeleteVoucherSerial(element.id).subscribe(
						(data: HttpReponseModel) => {
							this.toaster.openSuccessSnackBar(data.message);
							this.service.searchUpdateUserManageAction.next(true);
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				}
			})
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

	}

}


export interface ItemsWithPages {
	data: IVoucherSerialReponse[];
	totalCount: number;
}

