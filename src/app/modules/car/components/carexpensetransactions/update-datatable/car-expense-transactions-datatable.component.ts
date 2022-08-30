
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CarExpenseTransactionService } from "../../../services/car-expense-transactions.service";
import { UserLocationComponent } from "./user-locations/user-location.component";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { ViewimagesForCustomerComponent } from "./viewimages/viewimages.component";
import { MatSort, SortDirection } from "@angular/material/sort";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, map, merge, Observable, startWith, switchMap } from "rxjs";
import { IExpenseCarSearch } from "../../../models/IExpenseCarSearch.interface";
import { IReponseExpenseCar } from "../../../models/IResponseExpenseCar.interface";
@Component({
	selector: 'car-expense-transactions-datatable',
	templateUrl: './car-expense-transactions-datatablecomponent.html',
	styleUrls: ['./car-expense-transactions-datatable.component.scss']
})
export class CarExpenseTransactionDatatableComponent {

	displayedColumns: string[] = ['BranchName',
		'AreaName',
		'BlockName',
		'CustomerName',
		'CustomerCode',
		'CollectorName',
		'RequestDate',
		'UpdatedTypeName',
		'UpdatedTypeSysName'];

	data: IReponseExpenseCar[] = [];
	currentSearchParameter: IExpenseCarSearch = {} as IExpenseCarSearch;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private _httpClient: HttpClient, private service: CarExpenseTransactionService, public dialog: MatDialog) {
		this.currentSearchParameter = { pageNumber: 0, expense_Id: 0, pageSize: 0, carPlat: 0, endDate: '', startDate: '' };
	}

	ngAfterViewInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.paginator.page, this.service.searchUpdateUserManageStream$)
			.pipe(
				switchMap(() => {
					this.isLoadingResults = true;
					this.currentSearchParameter.pageNumber = this.paginator.pageIndex + 1;
					this.currentSearchParameter.pageSize = this.paginator.pageSize;

					// console.log(this.currentSearchParameter);
					return this.service.searchCustomerUpdate(this.currentSearchParameter);
				}),
				map((data: ItemsWithPages) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
			)
			.subscribe((data) => { this.data = data; });
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
			(data: IExpenseCarSearch) => {
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

	rowClicked(model: IReponseExpenseCar) {

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
	data: IReponseExpenseCar[];
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