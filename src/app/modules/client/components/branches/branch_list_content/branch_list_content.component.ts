import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, EMPTY } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { LookupService } from "src/app/shared-module/Services/Lookup.service";
import { IBranch } from "../../../models/IBranch";
import { ClientBranchService } from "../../../services/branch.service";
import { BranchUpsertComponent } from "../branch_Upsert/branch-upsert.component";
import { BranchAssignPathComponent } from "./branch_AssignPathRoutes/branch_AssignPathRoutes.component";
import { BranchPathRoutesLogs } from "./branch_pathroutes_logs/branch_pathroutes_logs.component";
import { UserLocationComponent } from "./user-locations/user-location.component";
@Component({
	selector: 'branch_list_content',
	templateUrl: './branch_list_content.component.html',
	styleUrls: ['./branch_list_content.component.scss']
})

export class BranchListContentComponent {
	panelOpenState:boolean = false;
    currentSelected:LookUpModel;
    companyId : number ;
    @Input() set _companyId (value:number){
		//subscribe here to invoke when insert done in upsert component
		this.companyId=value;
		this.service.selectFromStore().subscribe(data => {
			this.getallData(value);
		});
	};

	displayedColumns: string[] = ['name', 'address', 'state' , 'action'];

	dataSource:any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: ClientBranchService,private confirmationDialogService: ConfirmationDialogService, private toaster: toasterService ,private dialog: MatDialog) {

		this.currentSelected={Id:0,Name:'',company_Id:0};
	}
	
	AssignClientPathRoute(branchId:any){
		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(BranchAssignPathComponent,
			{
				maxHeight: '100vh',
				height: '100%',
             	position:dialogPosition,
				data: { branchId: branchId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	clientPathRouteLogs(branchId:any){
		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(BranchPathRoutesLogs,
			{
				maxHeight: '100vh',
				height: '100%',
             	position:dialogPosition,
				data: { branchId: branchId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}


    addNewBranch(branchId = 0){

		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(BranchUpsertComponent,
			{
				maxHeight: '100vh',
				height: '100%',
             	position:dialogPosition,
				data: { branchId: branchId , clientId:this.companyId}
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	currentLocation(x: number, y: number) {

		if (x == null || y == null || y==0 || x==0) {
			this.toaster.openWarningSnackBar("لايوجد موقع");
			return;
		}
		else {

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


	toggleActiveDeactive(element:IBranch){
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.companyId);
			},
			(error:any) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			});
	}


	DeAssignPathRoute(branchId:number){

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف تخصيص خط السير ? `)
		.then((confirmed) => {
			if (confirmed) {
				this.service.DeAssignPathRouteToClientBranch(branchId).subscribe(
					(data: HttpReponseModel) => {
						this.toaster.openSuccessSnackBar(data.message);
						//this.getallData(this.companyId);
					},
					(error:any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					});
			}
		})
		.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

	}

	toggleSalesPersonActiveDeactive(element:IBranch){
		this.service.toggleSalesActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.companyId);
			},
			(error:any) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			});
	}

	
	/*
	Submit(model: IBranch) {

		model.company_Id = 1;
        model.isActive=true;
		if (model.Id == 0) {
			model.Id=0;
			this.service.PostLookupData(model).
				subscribe(
					(data: HttpReponseModel) => {

						if(data.isSuccess){
							this.toaster.openSuccessSnackBar(data.message);
							this.service.bSubject.next(true);	
						}
						else if(data.isExists){
							this.toaster.openWarningSnackBar(data.message);
						}
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error);
					}
				);

		}

		else {
			this.service.UpdateLookupData(model).subscribe(
				(data: any) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error);
				});

		}

	}*/


// getting data and initialize data Source and Paginator
	getallData(companyId : number) {

		this.service.getBranchData(companyId).subscribe(
			(data: IBranch[]) => {
				// console.log(data);
				this.dataSource = new MatTableDataSource<IBranch>(data);
				this.dataSource.paginator = this.paginator;	
			}
		);

	}


//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}