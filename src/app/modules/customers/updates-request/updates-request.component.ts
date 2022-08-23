import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { map, merge, Subscription, switchMap } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { UserLocationComponent } from "../user-locations/user-location.component";
import { ICustomerEditResponse } from "../../operations/models/cutomer-editmanage/ICustomerEditResponse.interface";
import { customerUpdateManageService } from "../../operations/services/customer-update-manage.service";
import { ICustomerEditManageSearch } from "../../operations/models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { ViewimagesForCustomerComponent } from "../../operations/components/customer-update-manage/update-datatable/viewimages/viewimages.component";
import { ItemsWithPages } from "../../operations/components/customer-update-manage/update-datatable/update-datatable.component";
import { MatSort } from "@angular/material/sort";
@Component({
	selector: 'update-request',
	templateUrl: './updates-request.component.html',
	styleUrls: ['./updates-request.component.scss']
})

export class UpdateRequestComponent {

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: LookUpModel;

	displayedColumns: string[] = ['CollectorName',
	'RequestDate',
	'UpdatedTypeName',
	'UpdatedTypeSysName'];

	dataSource: ICustomerEditResponse[] = [];
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];
	customerId: number;

	constructor(
		private service: customerUpdateManageService,
		public dialog: MatDialog,
		private route: ActivatedRoute
	) {

		this.route.paramMap.subscribe((data: ParamMap) => {
			this.customerId = +data.get('customerId')!;
		});

	}

	ngAfterViewInit() {

		let modelSearch: ICustomerEditManageSearch = { CustomerId: this.customerId, AreaId: 0, BlockId: 0, BranchId: 0, CustomerCode: '', Employee_id: 0 , EndDate: '', StartDate: '', UpdatingTypeId: 0 };

		merge(this.paginator.page, this.service.searchUpdateUserManageStream$)
			.pipe(
				switchMap(() => {
					this.isLoadingResults = true;
					modelSearch.PageNumber = this.paginator.pageIndex + 1;
					return this.service.searchCustomerUpdate(modelSearch);
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
			.subscribe((data) => { this.dataSource = data; });

			this.service.searchUpdateUserManageAction.next(true);
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
	// getting data and initialize data Source and Paginator
	/*getallData(customerId: number) {

        let modelSearch : ICustomerEditManageSearch = {CustomerId:customerId,AreaId:0,BlockId:0,BranchId:0,CustomerCode:'',Employee_id:0,EndDate:'',StartDate:'',UpdatingTypeId:0};
		
		this.service.searchCustomerUpdate(modelSearch).subscribe(
			(data: ItemsWithPages) => {
				console.log(data);
				this.dataSource = new MatTableDataSource<ICustomerEditResponse>(data.data);
				this.dataSource.paginator = this.paginator;
			}
		);
	}
*/
	currentLocation(x:number,y:number){

		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(UserLocationComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position:dialogPosition,
				data: { x: x,y:y}
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});	}


	//filter from search Box
	/*applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}*/

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}