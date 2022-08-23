import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { map, merge, Subscription, switchMap } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { IComplainDisplay } from "../models/IComplain.interface";
import { UserLocationComponent } from "../user-locations/user-location.component";
import { ReadingService } from "../../operations/services/reading.service";
import { IReadingSearch } from '../../operations/models/IReadingSearch.interface';
import { IReading, IReadingList } from "../../operations/models/IReading.interface";
import { MatSort } from "@angular/material/sort";

@Component({
	selector: 'customer-reading',
	templateUrl: './customer-reading.component.html',
	styleUrls: ['./customer-reading.component.scss']
})

export class CustomerReadingComponent {

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: LookUpModel; resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;


	displayedColumns: string[] = ['collectorName', 'value',
		'lastReading', 'meterStatus', 'readingImagePath'
		, 'issueName', 'issueStatus', 'XY', 'issueDate', 'isRevised', 'isPosted', 'notes'];

	dataSource: any;


	userdata: IUserData;
	private unsubscribe: Subscription[] = [];
	customerId: number;

	constructor(
		private service: ReadingService,
		public dialog: MatDialog,
		private route: ActivatedRoute
	) {

		this.route.paramMap.subscribe((data: ParamMap) => {
			this.customerId = +data.get('customerId')!;
		});

	}
	ngAfterViewInit() {

		merge(this.paginator.page, this.service.searchUpdate$)
			.pipe(
				switchMap(() => {
					let search: IReadingSearch = { CustomerId: this.customerId, PageNumber: this.paginator.pageIndex + 1 };
					this.isLoadingResults = true;
					return this.service.getReadingsData(search);
				}),
				map((data: IReading) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalRecords;
					return data.data.map((item) => {
						return { ...item,actualreadingImagePath:item.readingImagePath, readingImagePath: localStorage.getItem("companyLink")?.toString().concat(item.readingImagePath) }
					})
				}),
			)
			.subscribe((data) => { this.dataSource = data; });

		this.service.searchUpdateAction.next(true);
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
	// getting data and initialize data Source and Paginator
	getallData(employeeId: number) {

		let search: IReadingSearch = { Employee_id: employeeId };

		this.service.getReadingsData(search).pipe(
			map(
				(data: IReading) => {
					return data.data.map((item) => {
						return { ...item, readingImagePath: localStorage.getItem("companyLink")?.toString().concat(item.readingImagePath) }
					})
				}
			)).subscribe(
				(data: any) => {
					// console.log(data.data);
					this.dataSource = new MatTableDataSource<IReadingList>(data.data);
					this.dataSource.paginator = this.paginator;
				}
			);
	}

	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}