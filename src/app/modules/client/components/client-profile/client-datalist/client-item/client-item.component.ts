import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { DialogPosition, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { left } from "@popperjs/core";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { IClientDisplayedData } from "src/app/modules/client/models/IClientDisplayedData.interface";
import { ClientService } from "src/app/modules/client/services/client.service";
import { ICompanyDisplayData } from "src/app/modules/hr/models/ICompanyDisplayData";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { ClientUpdateComponent } from "./client-update/client-update.component";
import { ClientUpsertComponent } from "./client-upsert/client-upsert.component";
@Component({
	selector: "client-item",
	templateUrl: './client-item.component.html',
	styleUrls: ['./client-item.component.scss']
})

export class ClientItemComponent {

	@Input() client: IClientDisplayedData;

	panelOpenState: boolean = false;

	companyIdForShowingBranches:number ;

    matDialogConfig: MatDialogConfig = new MatDialogConfig();

	constructor(private dialog: MatDialog, private toaster: toasterService, private service: ClientService, private cd : ChangeDetectorRef
	) { }
	logoWebFile: File;
	logoPrintFile: File;



	ngOnInit() {
	
		this.companyIdForShowingBranches = 0;
		this.cd.detectChanges();
		
	 }


	setCompanyIdGettingBranches(companyId : number){
		this.companyIdForShowingBranches = companyId;
		this.cd.detectChanges();
	}
	openDialogUpdate(clientId: number) {
		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(ClientUpdateComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position:dialogPosition,
				data: { clientId: clientId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}
	openDialog(clientId: number) {
		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(ClientUpsertComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position:dialogPosition,
				data: { clientId: clientId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

	toggleActiveClient(){

		this.service.activeOrNot(this.client).
		subscribe(
			(data: HttpReponseModel) => {

				if (data.isSuccess) {
					this.toaster.openSuccessSnackBar(data.message);
					this.client.isActive = !this.client.isActive;
					//	this.service.bSubject.next(true);
				}
				else if (data.isExists) {
					this.toaster.openWarningSnackBar(data.message);
				}
			},
			(error: any) => {
				console.log(error);
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			}
		);


	}

	


}