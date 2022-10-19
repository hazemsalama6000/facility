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
	clientCategorySelected: LookUpModel={} as LookUpModel;
	//dataSource = ELEMENT_DATA;
	columnsToDisplay = [
		'id',
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
		'clientCategory_Id',
		'checked'
	];
	columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
	expandedElement: PeriodicElement | null;

	data: IClientUpsertModel[] = [];
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: ClientService, private auth: AuthService,
		private ref: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.auth.userData.subscribe((data: IUserData) => {
			this.service.getClientCategories(data.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCategoryData = data;
				}
			);
		});
	}

	onItemSelectState(item: any) {
		this.clientCategorySelected = item;
		console.log(this.clientCategorySelected);
	}
	implementCategory(){
		let categoryId=this.clientCategorySelected.Id;
		this.data.filter(a=>a.checked==true).forEach(function (data) {
			data.clientCategory_Id = categoryId;
		});
	}

	setAllForClient(completed: boolean) {

		this.data.forEach(function (data) {
			data.checked = completed;
		});

	//	this.ref.detectChanges();

	}

	updateAllComplete(completed: boolean, id: number) {

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

			this.data = this.ExcelImportData;

			for (let i = 0; i < this.data.length; i++) {
				this.data[i].clientDataBranches = this.ExcelImportBranchData.filter((a: any) => a.clientData_Id == this.data[i].id)
			}

			console.log(this.data);

		}

	}


}