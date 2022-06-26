import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookupService } from "src/app/shared-module/Services/Lookup.service";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth";
@Component({
	selector: 'list_content',
	templateUrl: './list_content.component.html',
	styleUrls: ['./list_content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListContentComponent {

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: LookUpModel;

	displayedColumns: string[] = ['name', 'state', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	constructor(private service: LookupService, private toaster: toasterService, public dialog: MatDialog, private auth: AuthService,
		private confirmationDialogService: ConfirmationDialogService, private ref: ChangeDetectorRef) {

		this.currentSelected = { Id: 0, Name: '', company_Id: 0 };

		//subscribe here to invoke when insert done in upsert component
		const data = this.service.selectFromStore().subscribe(data => {
			const udata = this.auth.userData.subscribe(res => { this.userdata = res; this.getallData(); });
			this.unsubscribe.push(udata);
		});

		this.unsubscribe.push(data);
	}


	addNewRow() {
		let Item: Array<LookUpModel> = this.dataSource.data.filter((a: LookUpModel) => a.Id == 0);
		if (Item.length == 0) {
			this.dataSource.data.forEach((element: LookUpModel) => {
				element.isAdd = false;
				element.isEdit = false;
			});
			let newRow: LookUpModel = { Id: 0, Name: "", isActive: true, isAdd: true, isEdit: false, company_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			this.currentSelected = newRow;

			document.getElementById("NameForAdd")?.focus();

		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: LookUpModel) => a.Id != 0);
	}

	rowClicked(model: LookUpModel) {
		if (model.Id != 0) {
			this.dataSource.data = this.dataSource.data.filter((a: LookUpModel) => a.Id != 0);
		}
		console.log(this.dataSource.data);
		this.currentSelected = model;
		this.dataSource.data.filter((a: LookUpModel) => a.Id != model.Id).forEach((element: LookUpModel) => {
			element.isAdd = false;
			element.isEdit = false;
		});
	}


	Submit(model: LookUpModel) {
		console.log(model);

		model.company_Id = this.userdata.companyId;

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


	toggleActiveDeactive(element: LookUpModel) {
		this.service.addFlag.next(false);
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData();

			},
			(error: any) => {
				console.log(error);
			});
	}



	Remove(model: LookUpModel) {
		this.service.addFlag.next(false);

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.Name} ? `)
			.then((confirmed) => {
				if (confirmed) {
					this.service.DeleteLookupData(model.Id).subscribe(
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
		this.service.getLookupData(this.userdata.companyId).subscribe(
			(data: LookUpModel[]) => {
				console.log(data);
				this.dataSource = new MatTableDataSource<LookUpModel>(data);
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

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}