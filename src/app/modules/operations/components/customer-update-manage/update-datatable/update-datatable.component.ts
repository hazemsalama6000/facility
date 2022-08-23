
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { customerUpdateManageService } from "../../../services/customer-update-manage.service";
import { ICustomerEditResponse } from "../../../models/cutomer-editmanage/ICustomerEditResponse.interface";
import { UserLocationComponent } from "./user-locations/user-location.component";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { ViewimagesForCustomerComponent } from "./viewimages/viewimages.component";
import { MatSort, SortDirection } from "@angular/material/sort";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, map, merge, Observable, startWith, switchMap } from "rxjs";
import { ICustomerEditManageSearch } from "../../../models/cutomer-editmanage/ICustomerEditManageSearch.interface";
@Component({
	selector: 'customer-update-datatable',
	templateUrl: './update-datatable.component.html',
	styleUrls: ['./update-datatable.component.scss']
})
export class updateCustomerManageComponent {

	displayedColumns: string[] = ['BranchName',
		'AreaName',
		'BlockName',
		'CustomerName',
		'CustomerCode',
		'CollectorName',
		'RequestDate',
		'UpdatedTypeName',
		'UpdatedTypeSysName'];

	data: ICustomerEditResponse[] = [];
	currentSearchParameter: ICustomerEditManageSearch = {} as ICustomerEditManageSearch;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private _httpClient: HttpClient, private service: customerUpdateManageService, public dialog: MatDialog) {
		this.currentSearchParameter = { AreaId: 0, BlockId: 0, BranchId: 0, CustomerCode: '', CustomerId: 0, Employee_id: 0, PageNumber: 0, UpdatingTypeId: 0, EndDate: '', StartDate: '' };
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

					// console.log(this.currentSearchParameter);
					return this.service.searchCustomerUpdate(this.currentSearchParameter);
				}),
				map((data:ItemsWithPages) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
			)
			.subscribe((data) => {this.data = data;  });
	}


	dataSource: any;


	ngOnInit(): void {
		/*
				this.service.searchUpdateUserManageStream$.subscribe(
					(data: ItemsWithPages) => {
						console.log(data);
						if (data) {
							this.data = data.items;
						}
						else {
							this.dataSource.data = [];
						}
					}
				);*/

		this.service.searchParameterStream$.subscribe(
			(data: ICustomerEditManageSearch) => {
				this.currentSearchParameter = data;
			}
		);
	}



	openDialogDisplayImages(imagePath: string) {
		// console.log(imagePath);
		// const dialogPosition: DialogPosition = {
		// 	top: '0px',
		// 	right: '0px'
		// };

		const dialogRef = this.dialog.open(ViewimagesForCustomerComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				minHeight: '50%',
				width: '50%',

				//panelClass: 'full-screen-modal',*/
				// position: dialogPosition,
				data: { imagePath: imagePath }
			});
	}

	rowClicked(model: ICustomerEditResponse) {

	}

	currentLocation(x: number, y: number) {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(UserLocationComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position: dialogPosition,
				data: { x: x, y: y }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

}

export interface ItemsWithPages {
	data: ICustomerEditResponse[];
	totalRecords: number;
}

/*export class ExampleHttpDatabase {

	constructor(private _httpClient: HttpClient) { }

	getRepoIssues(sort: string, order: SortDirection, page: number): Observable<ItemsWithPages> {
		const href = 'https://api.github.com/search/issues';
		const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1
			}`;

		return this._httpClient.get<ItemsWithPages>(requestUrl);
	}
}*/