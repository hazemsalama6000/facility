import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as XLSX from 'xlsx';
import { IClientExcel } from "../../models/IClientExcel.interface";
import { IClientForm } from "../../models/IClientForm.interface";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { IClientUpsertModel } from "../../models/IClientUpsertModel.interface";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { AuthService } from "src/app/modules/auth";
import { ClientService } from "../../services/client.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { PathrouteService } from "src/app/modules/declarations/services/pathroute.service";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
	description: string;
}

@Component({
	selector: 'import-clients-excel',
	templateUrl: './client-import-excel.component.html',
	styleUrls: ['./client-import-excel.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class ClientImportExcel implements OnInit {
	dropdownCategoryData: any = [];
	dropdownListDataForRegion: any = [];
	dropdownPathRouteData: any = [];

	clientCategorySelected: LookUpModel = {} as LookUpModel;
	dataSource: any;
	columnsToDisplay = [
		'index',
		'name',
		'clientDataCode',
		'clientCommercialName',
		'activity',
		'commercialRecord',
		'taxCardNum',
		'taxFileNum',
		'vatTaxNum',
		'vatTax',
		'isVatTaxActive',
		'withHoldTax',
		'isWithHoldTaxActive',
		'clientCategoryName',
		'checked'
	];
	columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
	expandedElement: PeriodicElement | null;

	data: IClientUpsertModel[] = [];
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	companyBranchId = 0;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: ClientService, private auth: AuthService,
		private ref: ChangeDetectorRef, private regionService: RegionService, private pathrouteService: PathrouteService, private toaster: toasterService) { }

	ngOnInit(): void {
		this.auth.userData.subscribe((data: IUserData) => {
			this.companyBranchId = data.branchId;
			this.service.getClientCategories(data.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCategoryData = data;
				}
			);
			this.pathrouteService.getLookUpPathRoute({ CompanyBranchId: data.branchId }).subscribe((data: LookUpModel[]) => {
				this.dropdownPathRouteData = data;
			});
			this.regionService.getLookupData().subscribe(
				(data: IRegion[]) => {
					this.dropdownListDataForRegion = data.map(item => ({ Id: item.id, Name: item.name }) as LookUpModel)
				}
			);

		});
	}

	onItemSelectState(item: any) {
		this.clientCategorySelected = item;
		console.log(this.clientCategorySelected);
	}

	implementCategory() {
		let categoryId = this.clientCategorySelected.Id;
		let categories =this.dropdownCategoryData;
		this.data.filter(a => a.checked == true).forEach(function (data) {
			data.clientCategory_Id = categoryId;
			data.clientCategoryName = categories.find((a:any) => a.Id == data.clientCategory_Id)?.Name;
		});
	}

	implementPathRouteId(clientId: number) {

		let pathRouteId = this.data.find(a => a.index == clientId)?.pathRouteId;
		let pathroutes =this.dropdownPathRouteData;

		this.data.find(a => a.index == clientId)?.clientDataBranches.filter(a => a.checked == true).forEach(function (data) {
			data.pathRoute_Id = pathRouteId;
			data.pathRouteName = pathroutes.find((a:any) => a.Id == data.pathRoute_Id)?.Name;
		});
	}

	implementRegionId(clientId: number) {
		let regionId = this.data.find(a => a.index == clientId)?.regionId!;
		let regions =this.dropdownListDataForRegion;

		this.data.find(a => a.index == clientId)?.clientDataBranches.filter(a => a.checked == true).forEach(function (data) {
			data.region_Id = regionId;
			data.regionName = regions.find((a:any) => a.Id == data.region_Id)?.Name;
		});
	}

	setAllForClient(completed: boolean) {

		this.data.forEach(function (data) {
			data.checked = completed;
		});

	}

	setAllForClientBranchPathRoute(completed: boolean, clientId: number) {

		this.data.find(a => a.index == clientId)?.clientDataBranches.forEach(function (data) {
			data.checked = completed;
		});

	}

	downloadExcel(){
		let element = document.createElement("a");
		element.download="ملف بيانات العملاء"; 
		element.href="../../../../../assets/files/clientsTemplate.xlsx";
		element.click();
	  }

	ExcelImportData: any;
	ExcelImportBranchData: any;

	ReadClientExcel(event: any) {
		let file = event.target.files[0];
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(file);

		fileReader.onload = (e) => {
			var workBook = XLSX.read(fileReader.result, { type: 'binary' });
			var sheetNames = workBook.SheetNames;
			//fill data from client sheet
			this.ExcelImportData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
			this.ExcelImportBranchData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]]);

			for (let i = 0; i < this.ExcelImportBranchData.length; i++) {
				this.ExcelImportBranchData[i].telephone = this.ExcelImportBranchData[i].telephone?.toString();
				this.ExcelImportBranchData[i].mobile = this.ExcelImportBranchData[i].mobile?.toString();
				this.ExcelImportBranchData[i].secondMobile = this.ExcelImportBranchData[i].secondMobile?.toString();
				this.ExcelImportBranchData[i].managerMobile = this.ExcelImportBranchData[i].managerMobile?.toString();
				this.ExcelImportBranchData[i].clientBranchCode = this.ExcelImportBranchData[i].clientBranchCode?.toString();
				this.ExcelImportBranchData[i].name = this.ExcelImportBranchData[i].name?.toString();
				this.ExcelImportBranchData[i].address = this.ExcelImportBranchData[i].address?.toString();
				this.ExcelImportBranchData[i].responsibleName = this.ExcelImportBranchData[i].responsibleName?.toString();
				this.ExcelImportBranchData[i].commercialName = this.ExcelImportBranchData[i].commercialName?.toString();

				this.ExcelImportBranchData[i].pathRouteName = this.dropdownPathRouteData.find((a:any) => a.Id == this.ExcelImportBranchData[i].pathRoute_Id)?.Name;
				this.ExcelImportBranchData[i].regionName =this.dropdownListDataForRegion.find((a:any) => a.Id == this.ExcelImportBranchData[i].region_Id)?.Name;

				//this.ExcelImportBranchData[i].message = "this.data[i].activity?.toString()"; 

				let message: string = "";

				if (this.ExcelImportBranchData[i].clientBranchCode == undefined) {
					message += ", الكود مطلوب";
				}
				if (this.ExcelImportBranchData[i].name == undefined) {
					message += ", الاسم مطلوب";
				}
				if (this.ExcelImportBranchData[i].telephone == undefined) {
					message += ",  التليفون مطلوب";
				}
				if (this.ExcelImportBranchData[i].mobile == undefined) {
					message += ",   الموبيل الفرع مطلوب";
				}
				if (this.ExcelImportBranchData[i].secondMobile == undefined) {
					message += ",   الموبيل الفرع 2 مطلوب";
				}
				if (this.ExcelImportBranchData[i].managerMobile == undefined) {
					message += ",   الموبيل مسؤول المبيعات 2 مطلوب";
				}
				if (this.ExcelImportBranchData[i].responsibleName == undefined) {
					message += " ,   اسم المسؤول مطلوب";
				}
				if (this.ExcelImportBranchData[i].address == undefined) {
					message += ", العنوان مطلوب";
				}


				this.ExcelImportBranchData[i].message = message != "" ? message : undefined;

			}

			this.data = this.ExcelImportData;

			for (let i = 0; i < this.data.length; i++) {
				this.data[i].clientDataCode = this.data[i].clientDataCode?.toString();
				this.data[i].commercialRecord = this.data[i].commercialRecord?.toString();
				this.data[i].taxCardNum = this.data[i].taxCardNum?.toString();
				this.data[i].vatTaxNum = this.data[i].vatTaxNum?.toString();
				this.data[i].name = this.data[i].name?.toString();
				this.data[i].activity = this.data[i].activity?.toString();
				this.data[i].clientDataBranches = this.ExcelImportBranchData.filter((a: any) => a.clientData_Id == this.data[i].index);
				this.data[i].companyBranch_Id = this.companyBranchId;
				this.data[i].index = i;
				console.log(this.dropdownCategoryData);
				this.data[i].clientCategoryName = this.dropdownCategoryData.find((a:any) => a.Id == this.data[i].clientCategory_Id)?.Name;
				
				console.log(this.data[i].clientCategoryName);

				for (let x = 0; x < this.data[i].clientDataBranches.length; x++) {
					this.data[i].clientDataBranches[x].index = x;
				}

				this.data[i].iserrorInBranch = this.data[i].clientDataBranches.filter(a => a.message != undefined).length > 0 ? true : false;

				let message: string = "";

				if (this.data[i].clientDataCode == undefined || this.data[i].clientDataCode == "") {
					message += ", الكود مطلوب";
				}
				if (this.data[i].name == undefined) {
					message += ", الاسم مطلوب";
				}
				if (this.data[i].activity == undefined) {
					message += ",  النشاط مطلوب";
				}
				if (this.data[i].commercialRecord == undefined) {
					message += ",  السجل التجارى مطلوب";
				}
				if (this.data[i].taxCardNum == undefined) {
					message += " ,  رقم تسجيل ض.ق مطلوب";
				}

				this.data[i].message = message != "" ? message : undefined;

			}

			console.log(this.data);

			this.dataSource = new MatTableDataSource<IClientUpsertModel>(this.data);
			this.dataSource.paginator = this.paginator;
		}

	}




	Submit() {

		this.service.PostClientData(this.data).
			subscribe(
				(data: HttpReponseModel) => {

					if (data.isSuccess) {
						this.toaster.openSuccessSnackBar(data.message);
						// console.log(data.message);
						document.getElementById("closeme")?.click();
						this.service.bSubject.next(true);
					}
					else if (data.isExists) {
						this.toaster.openWarningSnackBar(data.message);
					}
				},
				(error: any) => {
					console.log(error);
					if (typeof error === 'object') {
						for (var i = 0; i < error.data.length; i++) {
							this.data[error.data[i].index].message = error.data[i].message;

							for (var x = 0; x < error.data[i].clientDataBranches.length; x++) {
								this.data[error.data[i].index].clientDataBranches[error.data[i].clientDataBranches[x].index].message = error.data[i].clientDataBranches[x].message;
								this.data[error.data[i].index].iserrorInBranch = true;
							}

						}
					}
					else {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					}

				}
			);

	}

}