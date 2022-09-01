import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { AuthService } from "src/app/modules/auth";
import { DatePipe } from "@angular/common";
import { ItemService } from "src/app/modules/items/services/item.service";
import { UnitService } from "src/app/modules/items/services/units.service";
import { UnitConversionService } from "src/app/modules/items/services/unitconversion.service";
import { IUnitConversionForm } from "src/app/modules/items/models/unit-converion/IUnitConversionForm.interface";

@Component({
	selector: "unit-converion-popup",
	templateUrl: './unit-converion-popup.component.html',
	styleUrls: ['./unit-converion-popup.component.scss']
})

export class UnitConverionPopupComponent implements OnInit {

	saveButtonClickedFlag = false;
	companyId: number;
	isEdit = false;
	attachment: File;
	isEditable: boolean = false;
	baseUnitName: string="";
	dropdownItems: LookUpModel[] = [];
	dropdownRelatedUnits: LookUpModel[] = [];

	panelOpenState: boolean = true;

	unitConversionDataForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private toaster: toasterService,
		private auth: AuthService,
		private itemService: ItemService,
		private unitService: UnitService,
		private unitConversionService:UnitConversionService, private datePipe: DatePipe
	) { }


	setDefaultForForm() {
		this.unitConversionDataForm = this.fb.group({
			unit_Id: ['', Validators.compose([Validators.required])],
			itemData_Id: ['', Validators.compose([Validators.required])],
			barcode: [''],
			factor: [0, Validators.compose([Validators.pattern("^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$")])],
		});
	}


	fillDropDowns() {
		this.auth.userData.subscribe((data: IUserData) => {
			this.companyId=data.companyId
			this.itemService.getLookUpItems(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownItems = data;
			});
		});
	}

	filterItemRelatedUnits(ele: any) {
		this.unitService.getLookUpItemsRelatedUnits(ele.Id).subscribe((data: LookUpModel[]) => {
				this.dropdownRelatedUnits = data;
		},(err)=>{this.dropdownRelatedUnits=[];});

		this.unitService.getItemsBaseUnit(ele.Id).subscribe((data: string) => {
			this.baseUnitName = data;
		});

	}

	ngOnInit() {
		this.setDefaultForForm();
		this.fillDropDowns();
	}


	Submit(unitConversionDataForm: IUnitConversionForm) {

		unitConversionDataForm.company_Id=this.companyId;
		unitConversionDataForm.isActive=true;
		if (this.unitConversionDataForm.valid) {

			this.unitConversionService.PostLookupData(unitConversionDataForm).
				subscribe(
					(data: HttpReponseModel) => {

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
							this.unitConversionService.bSubject.next(true);
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



}