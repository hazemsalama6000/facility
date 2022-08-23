
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { DialogPosition, MatDialog } from "@angular/material/dialog";

import { MatSort } from "@angular/material/sort";
import { map, merge, switchMap } from "rxjs";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ICustomerBIllsReponse } from "../../operations/models/bills/ICustomerBillsReponse.interface";
import { ICustomerEditManageSearch } from "../../operations/models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { CustomerBillsService } from "../../operations/services/customer-bills.service";
import { ICustomerEditResponse } from "../../operations/models/cutomer-editmanage/ICustomerEditResponse.interface";
import { ActivatedRoute, Params } from "@angular/router";

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
	description: string;
}


@Component({
	selector: 'customer-bill-datatable',
	templateUrl: './customer-bill-datatable.component.html',
	styleUrls: ['./customer-bill-datatable.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class BillDatatableComponent {

	//dataSource = ELEMENT_DATA;
	columnsToDisplay = ['payDate', 'totalAmount', 'branch',
		'area',
		'block',
		'customerCode',
		'customerName',
		'collectorName',
		'notes'];
	columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
	expandedElement: PeriodicElement | null;

	data: ICustomerBIllsReponse[] = [];
	currentSearchParameter: ICustomerEditManageSearch = {} as ICustomerEditManageSearch;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	employeeId: number;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: CustomerBillsService, public dialog: MatDialog,
		private route: ActivatedRoute) { }

	ngAfterViewInit() {
		// If the user changes the sort order, reset back to the first page.

		this.route.params.subscribe((data: Params) => {

			this.employeeId = +data['customerId']!;
			console.log(this.employeeId);
			merge(this.paginator.page, this.service.searchUpdateUserManageStream$)
				.pipe(
					switchMap(() => {
						this.isLoadingResults = true;
						this.currentSearchParameter.PageNumber = this.paginator.pageIndex + 1;
						this.currentSearchParameter.PageSize = this.paginator.pageSize;
						this.currentSearchParameter.CustomerId = this.employeeId;

						return this.service.searchCustomerBills(this.currentSearchParameter);
					}),
					map((data: ItemsWithPagesCustomeBills) => {
						this.isLoadingResults = false;
						this.isRateLimitReached = data === null;
						if (data === null) {
							return [];
						}
						this.resultsLength = data.totalPages;
						return data.data;
					}),
				)
				.subscribe((data) => { this.data = data; });

				this.service.searchUpdateUserManageAction.next(true);

		});

	}


	ngOnInit(): void {

		this.service.searchParameterStream$.subscribe(
			(data: ICustomerEditManageSearch) => {
				this.currentSearchParameter = data;
			}
		);
	}

	rowClicked(model: ICustomerEditResponse) {

	}

}

export interface ItemsWithPagesCustomeBills {
	data: ICustomerBIllsReponse[];
	totalPages: number;
}
