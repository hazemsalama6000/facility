import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUnitData } from "../../../models/units/IUnitData.interface";
import { UnitsService } from "../../../services/unit.service";
@Component({
	selector: 'units_list_content',
	templateUrl: './units_list_content.component.html',
	styleUrls: ['./units_list_content.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class UnitsListContentComponent {

	currentSelected: IUnitData;
	NameForAdd: string;
	dropdownListDataUnits: any = [];

	@Output() edit: EventEmitter<IUnitData> = new EventEmitter();

	displayedColumns: string[] = ['unitType','name', 'state', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata:IUserData;
	 private unsubscribe: Subscription[] = [];


	constructor(private service: UnitsService, private toaster: toasterService 
		, private confirmationDialogService: ConfirmationDialogService ,private regionService:RegionService 
		,private auth:AuthService) {
		//subscribe here to invoke when insert done in upsert component
		this.service.selectFromStore().subscribe(data => {
			this.getallData();
		});

		this.service.getLookupUnitTypeData().subscribe(
			(data: LookUpModel[]) => {
				this.dropdownListDataUnits = data
			}
		);

		this.currentSelected = { Id: 0,unitType:"",unitType_Id:0, Name: '', company_Id: 0 };

		const udata=this.auth.userData.subscribe(res=>this.userdata=res);
		this.unsubscribe.push(udata);
	}

	addNewRow() {

		let Item: Array<IUnitData> = this.dataSource.data.filter((a: IUnitData) => a.Id == 0);
		if (Item.length == 0) {
			let newRow: IUnitData = { Id: 0, Name: "",unitType:"",unitType_Id:0, isActive: false, isAdd: true, isEdit: false, company_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAddState")?.focus();
			this.currentSelected = newRow;
			this.service.emitStateIdSubject.next(this.currentSelected );
			this.dataSource.data.filter((a: IUnitData) => a.Id != 0).forEach((element: IUnitData) => {
				element.isAdd = false;
				element.isEdit = false;
			});
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: IUnitData) => a.Id != 0);
	}

	toggleActiveDeactive(element: IUnitData) {
		this.service.addFlag.next(false);

		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData();
			},
			(error: any) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:",""));
			});
	}

	Submit(model: IUnitData) {

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

	Remove(model: IUnitData) {
		this.service.addFlag.next(false);

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.Name} ? `)
		.then((confirmed) => {
			if (confirmed) {
				this.service.DeleteLookupData(model.Id).subscribe(
					(data: HttpReponseModel) => {
						this.service.emitStateIdSubject.next({Id:0,company_Id:0,Name:''});

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


	rowClicked(model: IUnitData) {
		this.regionService.addFlag.next(false);
		if (model.Id != 0) {
			this.dataSource.data = this.dataSource.data.filter((a: IUnitData) => a.Id != 0);
		}
		this.currentSelected = model;
		this.edit.emit(model);
		this.service.emitStateIdSubject.next(model);
		this.dataSource.data.filter((a: IUnitData) => a.Id != model.Id).forEach( (element:IUnitData) => {
			element.isAdd=false;
			element.isEdit=false;
		});
	}



	// getting data and initialize data Source and Paginator
	getallData() {
		this.service.getLookupData().subscribe(
			(data: IUnitData[]) => {
				this.dataSource = new MatTableDataSource<IUnitData>(data);
				this.dataSource.paginator = this.paginator;
				setTimeout(()=>{
					this.service.addFlag.subscribe((data) => {
						if (data == true) {
							this.addNewRow();
						}
					});
	
				},500);
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