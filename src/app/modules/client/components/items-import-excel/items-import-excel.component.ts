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
	companyId = 0;
	displayedColumns: string[] = ['id', 'barCode', 'code',
		'name', 'hasVatTax', 'vatTaxValue', 'description', 'hasExpireDate', 'expirationDate'
		,
		//'convertedUnitOfMeasure',
		'isActive', 'maxLimit', 'minLimit', 'orderingLimit', 'natureName'
		, 'itemCategoryName', 'unitName', 'checked'];

	dataSource: any;

	data: IItem[] = [];
	resultsLength = 0;
	event: any;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: ClientService, private auth: AuthService, private itemsCategoryService: ItemsCategoryService,
		private unitService: UnitService,

		private ref: ChangeDetectorRef, private regionService: RegionService, private pathrouteService: PathrouteService, private toaster: toasterService) { }

	ngOnInit(): void {
		this.auth.userData.subscribe((data: IUserData) => {
			this.companyId = data.companyId;
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
		let unitId = this.unitSelected?.Id;
		let units = this.dropdownUnitData;

		if (unitId == undefined) {
			this.toaster.openWarningSnackBar("اختر الوحدة");
		}
		else {
			this.data.filter(a => a.checked == true).forEach((data) => {
				data.unit_Id = unitId;
				data.unitName = units.find((a: any) => a.Id == data.unit_Id)?.Name;
			});
			this.validateDataInExcel();
		}

	}

	implementNature() {
		let value = this.NatureSelected?.value;
		let valueText = this.NatureSelected?.name;

		if (value == undefined) {
			this.toaster.openWarningSnackBar("اختر الطبيعة");
		}
		else {
			this.data.filter(a => a.checked == true).forEach((data) => {
				data.nature = value;
				data.natureName = valueText;
			});
			this.validateDataInExcel();
		}
	}

	implementCategory() {

		let categoryId = this.CategorySelected?.Id;
		let categories = this.dropdownCategoryData;

		if (categoryId == undefined) {
			this.toaster.openWarningSnackBar("اختر تصنيف");
		}
		else {
			this.data.filter(a => a.checked == true).forEach((data) => {
				data.itemCategory_Id = categoryId;
				data.itemCategoryName = categories.find((a: any) => a.Id == data.itemCategory_Id)?.Name;
			});
			this.validateDataInExcel();
		}

	}

	setAllForClient(completed: boolean) {

		this.data.forEach(function (data) {
			data.checked = completed;
		});

	}

	validateDataInExcel() {

		for (let i = 0; i < this.data.length; i++) {
			let message: string = "";

			if (this.data[i].code == undefined || this.data[i].code == "" || this.data[i].code.length < 4) {
				message += ",  الكود مطلوب والطول اكبر من 4 حروف";
			}
			if (this.data[i].name == undefined || this.data[i].name == "") {
				message += ", الاسم مطلوب";
			}
			if (this.data[i].unit_Id == undefined || this.data[i].unit_Id == 0) {
				message += ", الوحدة الصغرى";
			}
			if (this.data[i].itemCategory_Id == undefined || this.data[i].itemCategory_Id == 0) {
				message += ",  التصنيف مطلوب";
			}
			if (this.data[i].nature == undefined) {
				message += ", الطبيعة مطلوب";
			}
			if (this.data[i].maxLimit == undefined) {
				message += " , اكبر كمية مطلوب";
			}
			if (this.data[i].minLimit == undefined) {
				message += ", اصغر كمية سمطلوب";
			}
			if (this.data[i].orderingLimit == undefined) {
				message += ", الحد الادنى للطلب مطلوب";
			}
			if (this.data[i].vatTaxValue == undefined && this.data[i].hasVatTax == true) {
				message += ",   ضريبة القيمة مطلوب";
			}
			if (this.data[i].vatTaxValue != undefined && this.data[i].hasVatTax == false) {
				this.data[i].vatTaxValue = 0;
			}

			this.data[i].errorMessage = message != "" ? message : undefined;

		}
	}

	ExcelImportData: any;
	ExcelImportBranchData: any;

	ReadClientExcel(event: any) {
		this.event = event;
		let file = event.target.files[0];
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(file);

		fileReader.onload = (e) => {
			var workBook = XLSX.read(fileReader.result, { type: 'binary' });
			var sheetNames = workBook.SheetNames;
			//fill data from client sheet
			this.ExcelImportData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { range: 1 });

			this.data = this.ExcelImportData as IItem[];

			for (let i = 0; i < this.data.length; i++) {
				let message: string = "";
				this.data[i].index = i + 1;
				this.data[i].barCode = this.data[i].barCode?.toString();
				this.data[i].code = this.data[i].code?.toString();
				this.data[i].company_Id = this.companyId;

				this.data[i].itemCategoryName = this.dropdownCategoryData.find((a: any) => a.Id == this.data[i].itemCategory_Id)?.Name;
				this.data[i].natureName = this.dropdownNatureData.find((a: any) => a.value == this.data[i].nature)?.name;
				this.data[i].unitName = this.dropdownUnitData.find((a: any) => a.Id == this.data[i].unit_Id)?.Name;

				console.log(this.dropdownCategoryData);

				if (this.data[i].code == undefined || this.data[i].code == "" || this.data[i].code.length < 4) {
					message += ",  الكود مطلوب والطول اكبر من 4 حروف";
				}
				if (this.data[i].name == undefined || this.data[i].name == "") {
					message += ", الاسم مطلوب";
				}
				if (this.data[i].unit_Id == undefined || this.data[i].unit_Id == 0) {
					message += ", الوحدة الصغرى";
				}
				if (this.data[i].itemCategory_Id == undefined || this.data[i].itemCategory_Id == 0) {
					message += ",  التصنيف مطلوب";
				}
				if (this.data[i].nature == undefined) {
					message += ", الطبيعة مطلوب";
				}
				if (this.data[i].maxLimit == undefined) {
					message += " , اكبر كمية مطلوب";
				}
				if (this.data[i].minLimit == undefined) {
					message += ", اصغر كمية سمطلوب";
				}
				if (this.data[i].orderingLimit == undefined) {
					message += ", الحد الادنى للطلب مطلوب";
				}
				if (this.data[i].vatTaxValue == undefined && this.data[i].hasVatTax == true) {
					message += ",   ضريبة القيمة مطلوب";
				}
				if (this.data[i].vatTaxValue != undefined && this.data[i].hasVatTax == false) {
					this.data[i].vatTaxValue = 0;
				}

				this.data[i].errorMessage = message != "" ? message : undefined;

			}

			this.dataSource = new MatTableDataSource<IItem>(this.data);
			this.dataSource.paginator = this.paginator;
		}

	}

	downloadExcel() {
		let element = document.createElement("a");
		element.download = "ملف بيانات الاصناف";
		element.href = "../../../../../assets/files/itemsTemplate.xlsx";
		element.click();
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

				if (typeof error === 'object') {
					for (var i = 0; i < error.data.length; i++) {
						this.data[error.data[i].index].errorMessage = error.data[i].message + ' , ';
					}
				}
				else {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				}
			}
		);

	}

}