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
import { ActivatedRoute } from "@angular/router";
import { ComplainTypeService } from "src/app/shared-module/Services/complainType.service";
@Component({
	selector: 'list_content',
	templateUrl: './list_content.component.html',
	styleUrls: ['./list_content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListContentComponent {
	saveButtonClickedFlag = false;
	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: LookUpModel;

	displayedColumns: string[] = ['name', 'state', 'action'];
	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata: IUserData;
	pageName: string = '';
	private unsubscribe: Subscription[] = [];

	constructor(
		private jobService: LookupService,
		private compainTypeService: ComplainTypeService,
		private toaster: toasterService,
		public dialog: MatDialog,
		private auth: AuthService,
		private confirmationDialogService: ConfirmationDialogService,
		private ref: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute
	) {
		this.currentSelected = { Id: 0, Name: '', company_Id: 0 };

		let sub = this.activatedRoute.data.subscribe(v => { this.pageName = v.page });
		this.unsubscribe.push(sub);

		//subscribe here to invoke when insert done in upsert component
		const udata = this.auth.userData.subscribe(res => {
			this.userdata = res;
			if (this.pageName == 'jobs') {
				const datajob = this.jobService.selectFromStore().subscribe(data => { this.getallData(); });
				this.unsubscribe.push(datajob);
			} else if (this.pageName == 'compainType') {
				const datacomplain = this.compainTypeService.selectFromStore().subscribe(data => { this.getallData(); });
				this.unsubscribe.push(datacomplain);
			}
		});
		this.unsubscribe.push(udata);


		if (this.pageName == 'jobs') {
			this.jobService.addFlag.subscribe((data) => { if (data == true) this.addNewRow(); });
		} else if (this.pageName == 'compainType') {
			this.compainTypeService.addFlag.subscribe((data) => { if (data == true) this.addNewRow(); });
		}

	}

	addNewRow() {
		let Item: Array<LookUpModel> = this.dataSource.data.filter((a: LookUpModel) => a.Id == 0);
		if (Item.length == 0) {
			this.dataSource.data.forEach((element: LookUpModel) => { element.isAdd = false; element.isEdit = false; });
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
		this.currentSelected = model;
		this.dataSource.data.filter((a: LookUpModel) => a.Id != model.Id).forEach((element: LookUpModel) => {
			element.isAdd = false;
			element.isEdit = false;
		});
	}

	Submit(model: LookUpModel, index: number) {

		model.company_Id = this.userdata.companyId;
		if (model.Name.trim() == '' || model.Name == null) {
			this.toaster.openErrorSnackBar('برجاء أدخال نوع الشكوى');
			return;
		} else {

			if (model.Id == 0) {
				model.Id = 0;

				if (this.pageName == 'jobs') {
					this.jobService.PostLookupData(model).subscribe(
						(data: HttpReponseModel) => {

							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								this.jobService.bSubject.next(true);
								this.jobService.addFlag.next(true);

							}
							else if (data.isExists) {
								this.toaster.openWarningSnackBar(data.message);
							}
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						}
					);
				} else if (this.pageName == 'compainType') {
					this.compainTypeService.PostLookupData(model).subscribe(
						(data: HttpReponseModel) => {
							if (data.isSuccess) {
								this.toaster.openSuccessSnackBar(data.message);
								this.compainTypeService.bSubject.next(true);
								this.compainTypeService.addFlag.next(true);
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

			}

			else {

				if (this.pageName == 'jobs') {
					this.jobService.UpdateLookupData(model).subscribe(
						(data: any) => {
							this.dataSource.data[index].isEdit = false;
							this.dataSource.data = this.dataSource.data;
							this.toaster.openSuccessSnackBar(data.message);
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				} else if (this.pageName == 'compainType') {
					this.compainTypeService.UpdateLookupData(model).subscribe(
						(data: any) => {
							this.dataSource.data[index].isEdit = false;
							this.dataSource.data = this.dataSource.data;
							this.toaster.openSuccessSnackBar(data.message);
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				}

			}
		}
	}

	toggleActiveDeactive(element: LookUpModel) {
		if (this.pageName == 'jobs') {
			this.jobService.addFlag.next(false);
			this.jobService.toggleActiveDeactive(element).subscribe(
				(data: HttpReponseModel) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.getallData();

				},
				(error: any) => {
					console.log(error);
				});
		} else if (this.pageName == 'compainType') {
			this.compainTypeService.addFlag.next(false);
			this.compainTypeService.UpdateLookupData(element).subscribe(
				(data: HttpReponseModel) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.getallData();
				},
				(error: any) => console.log(error)
			);
		}

	}

	Remove(model: LookUpModel) {
		this.jobService.addFlag.next(false);

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.Name} ? `)
			.then((confirmed) => {
				if (confirmed) {
					if (this.pageName == 'jobs') {
						this.jobService.DeleteLookupData(model.Id).subscribe(
							(data: HttpReponseModel) => {
								this.toaster.openSuccessSnackBar(data.message);
								this.getallData();
							},
							(error: any) => {
								this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
							});
					} else if (this.pageName == 'compainType') {
						this.compainTypeService.DeleteLookupData(model.Id).subscribe(
							(data: HttpReponseModel) => {
								this.toaster.openSuccessSnackBar(data.message);
								this.getallData();
							},
							(error: any) => {
								this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
							});
					}

				}
			})
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

	}

	// getting data and initialize data Source and Paginator
	getallData() {
		if (this.pageName == 'jobs') {
			this.jobService.getLookupData(this.userdata.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dataSource = new MatTableDataSource<LookUpModel>(data);
					this.dataSource.paginator = this.paginator;
				}
			);
		} else if (this.pageName == 'compainType') {
			this.compainTypeService.getLookupData(this.userdata.companyId).subscribe(
				(data: LookUpModel[]) => {
					this.dataSource = new MatTableDataSource<LookUpModel>(data);
					this.dataSource.paginator = this.paginator;
				}
			);
		}

	}

	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		if (this.pageName == 'jobs') {
			this.jobService.addFlag.next(false);
		} else if (this.pageName == 'compainType') {
			this.compainTypeService.addFlag.next(false);
		}
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}