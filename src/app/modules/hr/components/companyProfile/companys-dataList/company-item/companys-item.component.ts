import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { DialogPosition, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { left } from "@popperjs/core";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { ICompanyDisplayData } from "src/app/modules/hr/models/ICompanyDisplayData";
import { CompanyService } from "src/app/modules/hr/services/company.service";
import { CompanyUpsertComponent } from "./companys-upsert/company-upsert.component";
@Component({
	selector: "company-item",
	templateUrl: './companys-item.component.html',
	styleUrls: ['./companys-item.component.scss']
})

export class CompanyItemComponent {

	@Input() company: ICompanyDisplayData;

	panelOpenState: boolean = false;

	companyIdForShowingBranches:number ;

    matDialogConfig: MatDialogConfig = new MatDialogConfig();

	constructor(private dialog: MatDialog, private toaster: toasterService, private service: CompanyService, private cd : ChangeDetectorRef
	) { }
	logoWebFile: File;
	logoPrintFile: File;



	ngOnInit() {
		/*this.matDialogConfig.position = { left: `200px`, top: `200px` };
		this.matDialogConfig.width = '300px';
		this.matDialogConfig.height = '400px';
		*/
		this.companyIdForShowingBranches = 0;
		this.cd.detectChanges();
		
	 }


	setCompanyIdGettingBranches(companyId : number){
		this.companyIdForShowingBranches = companyId;
		this.cd.detectChanges();
	}

	openDialog(companyId: number) {
		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(CompanyUpsertComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position:dialogPosition,
				data: { companyId: companyId }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

	logoPrintChange(event: any) {
		this.logoPrintFile = <File>event.target.files[0];
		const fd = new FormData();
		fd.append('companyLogo', this.logoPrintFile, this.logoPrintFile.name);
		fd.append('company_Id', this.company.id.toString());

		this.service.changeLogoPrint(fd).
			subscribe(
				(data: HttpReponseModel) => {

					if (data.isSuccess) {
						this.toaster.openSuccessSnackBar(data.message);
						this.company.logoPrint = `${localStorage.getItem('companyLink')}${data.data}`;
						// console.log(this.company.logoPrint);
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

	activeCompany(){

		this.service.activeOrNot(this.company).
		subscribe(
			(data: HttpReponseModel) => {

				if (data.isSuccess) {
					this.toaster.openSuccessSnackBar(data.message);
					this.company.isActive = !this.company.isActive;
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

	logoWebChange(event: any) {
		this.logoWebFile = <File>event.target.files[0];
		const fd = new FormData();
		fd.append('companyLogo', this.logoWebFile, this.logoWebFile.name);
		fd.append('company_Id', this.company.id.toString());
		this.service.changeLogoWebData(fd).
			subscribe(
				(data: HttpReponseModel) => {

					if (data.isSuccess) {
						this.toaster.openSuccessSnackBar(data.message);
						// console.log(data.data);
						this.company.logoWeb = `${localStorage.getItem('companyLink')}${data.data}`
						// console.log(this.company.logoWeb);
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