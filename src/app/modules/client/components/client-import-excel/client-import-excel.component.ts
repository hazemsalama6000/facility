import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as XLSX from 'xlsx';
import { IClientExcel } from "../../models/IClientExcel.interface";
import { IClientForm } from "../../models/IClientForm.interface";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { IClientUpsertModel } from "../../models/IClientUpsertModel.interface";

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
		  state('collapsed', style({height: '0px', minHeight: '0'})),
		  state('expanded', style({height: '*'})),
		  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	  ],
})

export class ClientImportExcel {
	
	//dataSource = ELEMENT_DATA;
	columnsToDisplay = ['name',
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
	'isAddedClientBranch',
	'clientCategory_Id',
];
	columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
	expandedElement: PeriodicElement | null;

	data: IClientUpsertModel[] = [];
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	
	constructor() { }

	ExcelImportData: any;

	ReadClientExcel(event: any) {
		let file = event.target.files[0];
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(file);

		fileReader.onload = (e) => {
			var workBook = XLSX.read(fileReader.result, { type: 'binary' });
			var sheetNames = workBook.SheetNames;
			//fill data from client sheet
			this.ExcelImportData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
			console.log(this.ExcelImportData);

			this.data = this.ExcelImportData;

			
		}

	}


}