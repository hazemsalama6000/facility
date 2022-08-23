import { Component } from "@angular/core";
import { DialogPosition, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { environment } from "src/environments/environment";
import { ICompanyDisplayData } from "../../../models/ICompanyDisplayData";
import { CompanyService } from "../../../services/company.service";
import { EmployeeService } from "../../../../employees/services/employee.service";
import { CompanyUpsertComponent } from "./company-item/companys-upsert/company-upsert.component";
@Component({
	selector: "company-DataList",
	templateUrl: './companys-dataList.component.html',
	styleUrls: ['./companys-dataList.component.scss']
})

export class CompanysDataListComponent {

	matDialogConfig: DialogPosition;

	companys: Array<ICompanyDisplayData> = [];

	toolbarButtonMarginClass = 'ms-1 ms-lg-3';
	toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
	toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
	toolbarButtonIconSizeClass = 'svg-icon-1';
	headerLeft: string = 'menu';
	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	constructor(
		private companyService: CompanyService,
		private dialog: MatDialog,
		private stateService: StatesService,
		private employeeService: EmployeeService,
		private regionService: RegionService,
		private auth: AuthService) { }


	openDialog() {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(CompanyUpsertComponent,
			{
				/*maxWidth: '100vw',
				maxHeight: '100vh',
				height: '100%',
				width: '100%',
				panelClass: 'full-screen-modal',*/
				maxHeight: '100vh',
				height: '100%',

				position: dialogPosition,
				data: { companyId: 0 }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

	ngOnInit() {

		this.stateService.getLookupData().subscribe(
			(data: LookUpModel[]) => {
				this.stateService.states = data;
			}
		);


		this.companyService.bSubject.subscribe(data => {

			this.companyService.getCompanyData().subscribe(
				(data: Array<ICompanyDisplayData>) => {
					this.companys = data.map(item => ({
						...item, logoWeb: `${localStorage.getItem('companyLink')}${item.logoWeb}`
						, logoPrint: `${localStorage.getItem('companyLink')}${item.logoPrint}`
					}) as ICompanyDisplayData);

					// console.log(this.companys);
				}
			);

		});

		const userdata = this.auth.userData.subscribe(res => this.userdata = res);
		this.unsubscribe.push(userdata);
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}