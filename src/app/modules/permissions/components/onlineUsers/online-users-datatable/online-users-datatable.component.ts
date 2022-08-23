import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookupService } from "src/app/shared-module/Services/Lookup.service";
import { OnlineUsersService } from "../../../services/onlineUsers.service";
import { IOnlineUsers } from "../../../models/IOnlineUsers.interface";
import { AuthService } from "src/app/modules/auth";
import { map } from "rxjs";
import { UserLocationComponent } from "./user-locations/user-location.component";
@Component({
	selector: 'online-users-datatable',
	templateUrl: './online-users-datatable.component.html',
	styleUrls: ['./online-users-datatable.component.scss'],
})

export class OnlineUsersDatatableComponent implements OnInit {

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: IOnlineUsers;

	displayedColumns: string[] = ['name', 'mobile', 'companyName', 'branchNameName',
		'userName', 'loginDate', 'timeRemaining', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: OnlineUsersService, private toaster: toasterService, public dialog: MatDialog,
		private confirmationDialogService: ConfirmationDialogService, private ref: ChangeDetectorRef, private auth: AuthService) { }


	ngOnInit(): void {
		this.service.bSubject.subscribe(
				(data: IOnlineUsers[]) => {

					if (data ) {
						this.dataSource = new MatTableDataSource<IOnlineUsers>(data);
						this.dataSource.paginator = this.paginator;
					}
					else{
						this.dataSource.data = [];
					}
				}
			);
	}

	currentLocation(empId:number){
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
				data: { empId: empId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});	}

	stopConnection(userId: number) {

		this.auth.logoutByUserId(userId).subscribe(
			(data: HttpReponseModel) => { this.toaster.openSuccessSnackBar(data.message); this.service.clickSearch$.next(true); },
			(error) => { this.toaster.openWarningSnackBar(error.toString().replace("Error:", "")) }
		);

	}

	rowClicked(model: IOnlineUsers) {

	}


	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}