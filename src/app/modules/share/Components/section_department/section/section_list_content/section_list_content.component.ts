import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { ISection } from "src/app/modules/share/models/ISection.interface";
import { DepartmentService } from "src/app/modules/share/Services/department_section/department.service";
import { SectionService } from "src/app/modules/share/Services/department_section/section.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { Job_upsertComponent } from "./job_upsert/job_upsert.component";

@Component({
	selector: 'section_list_content',
	templateUrl: './section_list_content.component.html',
	styleUrls: ['./section_list_content.component.scss']
})

export class SectionListContentComponent {

	currentDepartmentId = 0;
	currentDepartment: LookUpModel;
	@Output() edit: EventEmitter<ISection> = new EventEmitter();

	displayedColumns: string[] = ['name', 'state', 'action'];

	dataSource: any;

	currentSelected: ISection;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: SectionService, private toaster: toasterService, private DepartmentService: DepartmentService, private confirmationDialogService: ConfirmationDialogService, private dialog: MatDialog) {
		this.currentSelected = { department_Id: 0, id: 0, isActive: false, name: "", isEdit: false, isAdd: false };
		//subscribe here to invoke when insert done in upsert component
		this.service.selectFromStore().subscribe(data => {
			this.getallData(this.currentDepartmentId);
		});

		this.DepartmentService.getDepartmentIdObservable().subscribe((data: LookUpModel) => {

			this.currentDepartment = data;

			if (data.Id == 0) {
				this.dataSource.data = [];
			} else {
				this.currentDepartmentId = data.Id;
				console.log(this.currentDepartmentId);
				this.getallData(this.currentDepartmentId);
			}

		});

	}

	addNewRow() {
		let Item: Array<ISection> = this.dataSource.data.filter((a: ISection) => a.id == 0);
		if (Item.length == 0) {
			let newRow: ISection = { id: 0, name: "", isActive: true, isAdd: true, isEdit: false, department_Id: 0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAddSection")?.focus();
			this.dataSource.data.filter((a: ISection) => a.id != 0).forEach((element: ISection) => {
				element.isAdd = false;
				element.isEdit = false;
			});
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: ISection) => a.id != 0);
	}


	rowClicked(model: ISection) {
		if (model.id != 0) {
			this.dataSource.data = this.dataSource.data.filter((a: ISection) => a.id != 0);
		}
		this.currentSelected = model;
		this.dataSource.data.filter((a: ISection) => a.id != model.id).forEach((element: LookUpModel) => {
			element.isAdd = false;
			element.isEdit = false;
		});
	}

	//emit model to upsert component for updating
	Edit(model: ISection) {
		model.department_Id = this.currentDepartmentId;
		this.edit.emit(model);
	}


	Remove(model: ISection) {
		this.service.addFlag.next(false);

		this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
			.then((confirmed) => {
				if (confirmed) {
					this.service.DeleteLookupData(model.id).subscribe(
						(data: HttpReponseModel) => {
							this.toaster.openSuccessSnackBar(data.message);
							this.getallData(this.currentDepartmentId);
						},
						(error: any) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						});
				}
			})
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

	}


	toggleActiveDeactive(element: ISection) {
		this.service.addFlag.next(false);

		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.currentDepartmentId);
			},
			(error: any) => {
				console.log(error);
			});
	}
	Submit(model: ISection) {
		model.department_Id = this.currentDepartmentId;
		if (model.id == 0) {

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
					//	this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				});

		}

	}

	// getting data and initialize data Source and Paginator
	getallData(stateId: number) {
		this.service.getLookupData(this.currentDepartmentId).subscribe(
			(data: ISection[]) => {
				this.dataSource = new MatTableDataSource<ISection>(data);
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

	openJobDialog(id: number) {
		this.dialog.open(Job_upsertComponent,
			{
				height: '50%',
				width: '300px',
				data: { sectionId: id }
			});
	}

}