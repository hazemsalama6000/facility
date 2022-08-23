import {Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TechnitianService } from "../services/technitian.service";
import { ITechnitianLog } from "../models/ITechnitianLog.interface";
@Component({
	selector: 'technician-log',
	templateUrl: './technician-log.component.html',
	styleUrls: ['./technician-log.component.scss']
})

export class technicianLogComponent {


	displayedColumns: string[] = ['insertDate','updateDate','canCollect', 'canRead','canComplain','canEditCustomer' , 'attachImageRead'
	 , 'attachImageEditCustomer', 'maxOfflineWorkingHours','maxOfflineWorkingBills'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	constructor(
		private service: TechnitianService,
		public dialog: MatDialog,
		private route: ActivatedRoute
	) {

		this.route.paramMap.subscribe((data: ParamMap) => {
			this.getallData(+data.get('employeeId')!);
		});

	}



	// getting data and initialize data Source and Paginator
	getallData(employeeId: number) {
		this.service.getTechnicianLogByEmpId(employeeId).subscribe(
			(data: ITechnitianLog[]) => {
				// console.log(data);
				this.dataSource = new MatTableDataSource<ITechnitianLog>(data);
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