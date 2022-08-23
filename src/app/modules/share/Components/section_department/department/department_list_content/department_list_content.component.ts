import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { DepartmentService } from "src/app/modules/share/Services/department_section/department.service";
import { SectionService } from "src/app/modules/share/Services/department_section/section.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
@Component({
	selector: 'department_list_content',
	templateUrl: './department_list_content.component.html',
	styleUrls: ['./department_list_content.component.scss']
})

export class DepartmentListContentComponent {

	currentSelected: LookUpModel;
	NameForAdd: string;

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();

	displayedColumns: string[] = ['name', 'state', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata: IUserData;

	private unsubscribe: Subscription[] = [];


	constructor(private service: DepartmentService, private toaster: toasterService, private auth: AuthService,
		private confirmationDialogService: ConfirmationDialogService, private sectionService: SectionService) {
		//subscribe here to invoke when insert done in upsert component
		const data = this.service.selectFromStore().subscribe(data => {
			const udata = auth.userData.subscribe(res => { this.userdata = res; this.getallData(); })
			this.unsubscribe.push(udata);
		});
		this.unsubscribe.push(data)
		this.currentSelected = { Id: 0, Name: '', company_Id: 0 };
	}

	Submit(model: LookUpModel) {

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
					(error: string) => {
						this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					}
				);

		}

		else {
			this.service.UpdateLookupData(model).subscribe(
				(data: any) => {
					this.toaster.openSuccessSnackBar(data.message);
					//	this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				});

		}

	}

	addNewRow() {
		let Item: Array<LookUpModel> = this.dataSource.data.filter((a: LookUpModel) => a.Id == 0);
		if (Item.length == 0) {
			let newRow: LookUpModel = { Id: 0, Name: "", isActive: false, isAdd: true, isEdit: false, company_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAddDepartment")?.focus();
			this.currentSelected = newRow;
			this.service.emitDepartmentIdSubject.next(this.currentSelected);
			this.dataSource.data.filter((a: LookUpModel) => a.Id != 0).forEach((element: LookUpModel) => {
				element.isAdd = false;
				element.isEdit = false;
			});
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: LookUpModel) => a.Id != 0);
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
							this.service.emitDepartmentIdSubject.next({ Id: 0, company_Id: 0, Name: '' });

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


	rowClicked(model: LookUpModel) {
		this.sectionService.addFlag.next(false);
		if (model.Id != 0) {
			this.dataSource.data = this.dataSource.data.filter((a: LookUpModel) => a.Id != 0);
		}
		this.currentSelected = model;
		this.edit.emit(model);
		this.service.emitDepartmentIdSubject.next(model);
		this.dataSource.data.filter((a: LookUpModel) => a.Id != model.Id).forEach((element: LookUpModel) => {
			element.isAdd = false;
			element.isEdit = false;
		});
	}

	// getting data and initialize data Source and Paginator
	getallData() {
		this.service.getLookupData(this.userdata.companyId).subscribe(
			(data: LookUpModel[]) => {
				this.dataSource = new MatTableDataSource<LookUpModel>(data);
				this.dataSource.paginator = this.paginator;
				// console.log(data);
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
		this.unsubscribe.forEach((sb) => sb.unsubscribe())
	}
}