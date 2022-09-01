import {  ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUnitConverionResponse } from "../../../models/unit-converion/IUnitConverionResponse.interface";
import { UnitConversionService } from "../../../services/unitconversion.service";

@Component({
	selector: 'unit-conversion-list-content',
	templateUrl: './unit-conversion-list-content.component.html',
	styleUrls: ['./unit-conversion-list-content.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class UnitConversionListContentComponent {

	currentSelected: LookUpModel;
	NameForAdd: string;
	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();

	displayedColumns: string[] = ['itemName','convertedUnitName','mainUnitName','factor','barcode', 'isActive','action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata:IUserData;
	 private unsubscribe: Subscription[] = [];


	constructor(private service: UnitConversionService, private toaster: toasterService 
		, private confirmationDialogService: ConfirmationDialogService ,private regionService:RegionService ,private auth:AuthService) {
		//subscribe here to invoke when insert done in upsert component
		this.service.selectFromStore().subscribe(data => {
			this.getallData();
		});

		this.currentSelected = { Id: 0, Name: '', company_Id: 0 };

		const udata=this.auth.userData.subscribe(res=>this.userdata=res);
		this.unsubscribe.push(udata);
	}

	addNewRow() {
		let Item: Array<LookUpModel> = this.dataSource.data.filter((a: LookUpModel) => a.Id == 0);
		if (Item.length == 0) {
			let newRow: LookUpModel = { Id: 0, Name: "", isActive: false, isAdd: true, isEdit: false, company_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAddState")?.focus();
			this.currentSelected = newRow;
			this.service.emitStateIdSubject.next(this.currentSelected );
			this.dataSource.data.filter((a: LookUpModel) => a.Id != 0).forEach((element: LookUpModel) => {
				element.isAdd = false;
				element.isEdit = false;
			});
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: LookUpModel) => a.Id != 0);
	}

	toggleActiveDeactive(element:any) {
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData();
			},
			(error: any) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:",""));
			});
	}

	Submit(model: LookUpModel) {

		model.company_Id = this.userdata.companyId;
		model.isActive = true;
		if (model.Id == 0) {
			model.Id = 0;
			this.service.PostLookupData(model).
				subscribe(
					(data: HttpReponseModel) => {

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
							this.service.bSubject.next(true);
							this.service.addFlag.next(true);
						}
						else if (data.isExists) {
							this.toaster.openWarningSnackBar(data.message);
						}
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:",""));
					}
				);

		}


	}


	
	Remove(element:any) {

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف  ? `)
			.then((confirmed) => {
				if (confirmed) {
					this.service.DeleteLookupData(element.id).subscribe(
						(data: HttpReponseModel) => {
							this.toaster.openSuccessSnackBar(data.message);
							this.getallData();
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				}
			})
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

	}



	// getting data and initialize data Source and Paginator
	getallData() {
		this.service.getLookupData().subscribe(
			(data: IUnitConverionResponse[]) => {
				this.dataSource = new MatTableDataSource<IUnitConverionResponse>(data);
				this.dataSource.paginator = this.paginator;
			}
		);
	}



	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy(){
		this.unsubscribe.forEach((sb)=>sb.unsubscribe());
	}

}