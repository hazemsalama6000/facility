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
import { IItem } from "src/app/modules/items/models/itemsCategory/IItem.interface";
import { UnitService } from "src/app/modules/items/services/units.service";
import { ItemsCategoryService } from "src/app/modules/items/services/itemsCategory.service";

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
	description: string;
}

@Component({
	selector: 'items-clients-excel',
	templateUrl: './items-import-excel.component.html',
	styleUrls: ['./items-import-excel.component.scss'],
})

export class ItemsImportExcel implements OnInit {
	dropdownUnitData: LookUpModel[] = [];
	dropdownCategoryData: LookUpModel[] = [];
	dropdownNatureData: any[] = [];

	CategorySelected: LookUpModel = {} as LookUpModel;
	unitSelected: LookUpModel = {} as LookUpModel;
	NatureSelected: any = {};

	displayedColumns: string[] = ['id', 'barCode', 'code',
		'name', 'hasVatTax', 'vatTaxValue', 'quantity', 'description', 'hasExpireDate', 'expirationDate'
		,
		//'convertedUnitOfMeasure',
		'isActive', 'maxLimit', 'minLimit', 'orderingLimit', 'nature'
		, 'itemCategory_Id', 'unit_Id', 'checked'];

	dataSource: any;

	data: IItem[] = [];
	resultsLength = 0;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: ClientService, private auth: AuthService, private itemsCategoryService: ItemsCategoryService,
		private unitService: UnitService,

		private ref: ChangeDetectorRef, private regionService: RegionService, private pathrouteService: PathrouteService, private toaster: toasterService) { }

	ngOnInit(): void {
		this.auth.userData.subscribe((data: IUserData) => {

			this.itemsCategoryService.getCategoryTypes(data.companyId).subscribe((res: LookUpModel[]) => this.dropdownCategoryData = res, (err) => console.log(err));
			this.unitService.getLookUpUnits(data.companyId).subscribe((res: LookUpModel[]) => this.dropdownUnitData = res, (err) => console.log(err));
			this.dropdownNatureData = [{ name: "أصل", value: true }, { name: "مستهلك", value: false }];

		});
	}

	onCategorySelect(item: any) {
		this.CategorySelected = item;
		console.log(this.CategorySelected);
	}
	onUnitSelect(item: any) {
		this.unitSelected = item;
		console.log(this.unitSelected);
	}
	onNatureSelected(item: any) {
		this.NatureSelected = item;
		console.log(this.NatureSelected);
	}

	implementUnit() {
		let unitId = this.unitSelected.Id;
		this.data.filter(a => a.checked == true).forEach(function (data) {
			data.unit_Id = unitId;
		});
	}

	implementNature() {
		let value = this.NatureSelected.value;
		this.data.filter(a => a.checked == true).forEach(function (data) {
			data.nature = value;
		});
	}

	implementCategory() {
		let categoryId = this.CategorySelected.Id;
		this.data.filter(a => a.checked == true).forEach(function (data) {
			data.itemCategory_Id = categoryId;
		});
	}

	setAllForClient(completed: boolean) {

		this.data.forEach(function (data) {
			data.checked = completed;
		});

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

			this.data = this.ExcelImportData;

			this.dataSource = new MatTableDataSource<IItem>(this.data);
			this.dataSource.paginator = this.paginator;
		}

	}




	Submit() {

		this.itemsCategoryService.AddItem(this.data).subscribe(
			(data: HttpReponseModel) => {
				if (data.isSuccess) {
					this.itemsCategoryService.bSubject.next(false);
					this.toaster.openSuccessSnackBar(data.message);
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