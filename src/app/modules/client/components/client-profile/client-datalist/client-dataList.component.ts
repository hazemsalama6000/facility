import { Component } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ClientService } from "../../../services/client.service";
import { ClientUpsertComponent } from "./client-item/client-upsert/client-upsert.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { PathrouteService } from "src/app/modules/declarations/services/pathroute.service";
import { IClientDisplayedData } from "../../../models/IClientDisplayedData.interface";
import { IClientSearchParams } from "../../../models/IClientSearchParams.interface";
@Component({
	selector: "client-DataList",
	templateUrl: './client-dataList.component.html',
	styleUrls: ['./client-dataList.component.scss']
})

export class ClientDataListComponent {


	dropdownPathRouteData: LookUpModel[] = [];
	dropdownCategoryData: LookUpModel[] = [];
	dropdownListDataForState: any = [];
	dropdownListDataForRegion: any = [];

	clientSearchForm: FormGroup;

	matDialogConfig: DialogPosition;

	clients: Array<IClientDisplayedData> = [];

	companyBranch: number;

	toolbarButtonMarginClass = 'ms-1 ms-lg-3';
	toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
	toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
	toolbarButtonIconSizeClass = 'svg-icon-1';
	headerLeft: string = 'menu';
	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	constructor(
		private clientService: ClientService,
		private dialog: MatDialog,
		private stateService: StatesService,
		private regionService: RegionService,
		private auth: AuthService, private fb: FormBuilder, private pathrouteService: PathrouteService) { }



	openDialog() {

		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(ClientUpsertComponent,
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
		this.clientSearchForm = this.fb.group({
			CompanyBranchId: [],
			Category_Id: [],
			State_Id: [],
			Region_Id: [],
			Name: [],
			PathRoute_Id: [],
			Code: []
		});

		this.clientService.searchUpdate$.subscribe((data)=>{
          document.getElementById("search")?.click();
		});

		this.auth.userData.subscribe((data: IUserData) => {
			this.companyBranch = data.branchId;
			this.clientService.getClientCategories(data.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCategoryData = data;
				}
			);

			this.pathrouteService.getLookUpPathRoute({ CompanyBranchId: data.branchId }).subscribe((data: LookUpModel[]) => {
				this.dropdownPathRouteData = data;
			});


			this.clientService.getClientsData({ CompanyBranchId: data.branchId } as IClientSearchParams).subscribe(
				(data: Array<IClientDisplayedData>) => {
					this.clients = data;
				}
			);

		});


		this.stateService.getLookupData().subscribe(
			(data: LookUpModel[]) => {
				this.dropdownListDataForState = data;
			}
		);

		const userdata = this.auth.userData.subscribe(res => this.userdata = res);
		this.unsubscribe.push(userdata);
	}


	searchClients(model: IClientSearchParams) {
		model.CompanyBranchId = this.companyBranch;
		this.clients = [];
		this.clientService.getClientsData(model).subscribe(
			(data: Array<IClientDisplayedData>) => {
				this.clients = data;
			}
		);
	}


	onItemSelectState(item: any) {
		this.regionService.getLookupData(item.Id).subscribe(
			(data: IRegion[]) => {
				this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
			}
		);

	}


	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}