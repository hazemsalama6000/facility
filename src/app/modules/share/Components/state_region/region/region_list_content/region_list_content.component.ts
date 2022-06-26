import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, EMPTY } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector: 'region_list_content',
	templateUrl: './region_list_content.component.html',
	styleUrls: ['./region_list_content.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush

})

export class RegionListContentComponent {

	currentStateId = 0;
	currentState: LookUpModel;
	currentSelected: IRegion;
	NameForAdd: string;

	@Output() edit: EventEmitter<IRegion> = new EventEmitter();

	displayedColumns: string[] = ['name', 'state', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: RegionService, private toaster: toasterService, private StatesService: StatesService, private confirmationDialogService: ConfirmationDialogService) {
		this.currentState = {} as LookUpModel;
		this.currentSelected = { id: 0, isActive: false, isEdit: false, isAdd: false, name: "", state_Id: 0 }
		//subscribe here to invoke when insert done in upsert component
		this.service.selectFromStore().subscribe(data => {
			this.getallData(this.currentStateId);
		});

		this.StatesService.getStateIdObservable().subscribe((data: LookUpModel) => {

			if (data.Id == 0) {
				this.dataSource.data = [];
				this.currentState = data;
			}
			else {
				this.currentStateId = data.Id;
				this.currentState = data;
				console.log(this.currentStateId);
				this.getallData(this.currentStateId);
			}

		});

	}

	rowClicked(model: IRegion) {
		if (model.id != 0) {
			this.dataSource.data = this.dataSource.data.filter((a: IRegion) => a.id != 0);
		}
		this.currentSelected = model;
		this.dataSource.data.filter((a: IRegion) => a.id != model.id).forEach((element: IRegion) => {
			element.isAdd = false;
			element.isEdit = false;
		});
	}



	Submit(model: IRegion) {

		console.log(model);

		model.state_Id = this.currentStateId;

		if (model.id == 0) {
			model.id == 0;
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
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					}
				);

		}

		else {
			this.service.UpdateLookupData(model).subscribe(
				(data: any) => {
					this.toaster.openSuccessSnackBar(data.message);
					//this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				});

		}

	}

	toggleActiveDeactive(element: IRegion) {
		this.service.addFlag.next(false);

		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.currentStateId);
			},
			(error: any) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			});
	}


	Remove(model: IRegion) {
		this.service.addFlag.next(false);

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
			.then((confirmed) => {
				if (confirmed) {
					this.service.DeleteLookupData(model.id).subscribe(
						(data: HttpReponseModel) => {
							this.toaster.openSuccessSnackBar(data.message);
							this.getallData(this.currentStateId);
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				}
			})
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
	}

	addNewRow() {
		let Item: Array<IRegion> = this.dataSource.data.filter((a: IRegion) => a.id == 0);
		if (Item.length == 0) {
			let newRow: IRegion = { id: 0, name: "", isActive: true, isAdd: true, isEdit: false, state_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAddRegion")?.focus();
			this.dataSource.data.filter((a: IRegion) => a.id != 0).forEach((element: IRegion) => {
				element.isAdd = false;
				element.isEdit = false;
			});
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: IRegion) => a.id != 0);
	}

	// getting data and initialize data Source and Paginator
	getallData(stateId: number) {
		this.service.getLookupData(this.currentStateId).subscribe(
			(data: IRegion[]) => {
				this.dataSource = new MatTableDataSource<IRegion>(data);
				this.dataSource.paginator = this.paginator;
				setTimeout(() => {
					this.service.addFlag.subscribe((data) => {
						if (data == true) {
							this.addNewRow();
						}
					});

				}, 500);
			}

		);
	}

	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}