import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { map, merge, Subscription, switchMap } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ComplainService } from "../../operations/services/complain.service";
import { IComplainDisplay } from "../models/IComplain.interface";
import { MatSort } from "@angular/material/sort";
import { IComplain } from "../../operations/models/IComplain.interface";
@Component({
	selector: 'complain-log',
	templateUrl: './complains.component.html',
	styleUrls: ['./complains.component.scss']
})

export class ComplainsComponent {
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	displayedColumns: string[] = ['Date', 'ComplaintTypeName', 
	'CollectorName', 'IssueName' , 'Details'
	 , 'IsRevised'];

	dataSource: any;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];
	customerId: number;

	constructor(
		private service: ComplainService,
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
					this.isLoadingResults = true;
					return this.service.getComplainsByCustomerId(this.customerId,this.paginator.pageIndex + 1,this.paginator.pageSize);
				}),
				map((data: IComplain) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
			)
			.subscribe((data) => { this.dataSource = data;});

			this.service.searchUpdateAction.next(true);
	}

	// getting data and initialize data Source and Paginator
/*	getallData(employeeId: number) {
		this.service.getComplainsByCustomerId(employeeId).subscribe(
			(data: IComplainDisplay[]) => {
				console.log(data);
				this.dataSource = new MatTableDataSource<IComplainDisplay>(data);
				this.dataSource.paginator = this.paginator;
			}
		);
	}*/

	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}