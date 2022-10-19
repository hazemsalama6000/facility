import { Component, OnInit } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { AuthService } from '../auth';
import { EmployeeUpsertComponent } from './employee-upsert/employee-upsert.component';
import { IEmployee } from './models/employee.interface';
import { ITechnitianLog } from './models/ITechnitianLog.interface';
import { EmployeeService } from './services/employee.service';
import { AddTechnitianLogComponent } from './setting/Add-technitian-Log/add-technitian-Log.component';

@Component({
	selector: 'app-employees',
	templateUrl: './employees.component.html',
	styleUrls: ['./employees.component.scss'],

})
export class EmployeesComponent implements OnInit {
	imageFile: File;
	companyId: number;
	branch_Id = 0;
	EmployeeId: number | null = null;
	dropdownEmployeeData: LookUpModel[] = [];
	employeeDsiaplay: IEmployee = { id: 0, imagePath: '', imagepathbase: '' } as IEmployee;

	constructor(private service: EmployeeService,
		private toaster: toasterService, public dialog: MatDialog, private auth: AuthService, private route: ActivatedRoute) {
		this.auth.userData.subscribe((userData) => {
			this.companyId = userData.companyId;
			this.branch_Id = userData.branchId;
		});
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			if (params.id) {
				this.EmployeeId = params.id;
				this.getEmployeeById(params.id);
			}
		});


		this.service.subjectEmployeeChangedStream.subscribe((data) => {
			if (this.employeeDsiaplay.id > 0) {
				this.service.getEmployeeById(this.employeeDsiaplay.id)
					.pipe(
						map(
							(data: IEmployee) => ({ ...data, imagePath: `${localStorage.getItem("companyLink")}${data.imagePath}`, imagepathbase: data.imagePath }) as IEmployee
						)
					)
					.subscribe((data: IEmployee) => { this.employeeDsiaplay = data; }
						, (error) => {
							this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
						}
					);
			}
		});


		this.service.bSubjectStream.subscribe((data) => {
			this.auth.userData.subscribe((userData) => {
				this.service.getLookupEmployeeData(userData.companyId).subscribe((data: LookUpModel[]) => {
					this.dropdownEmployeeData = data;
				});
			});

		});

		this.service.bSubject.next(true);
	}


	imageChange(event: any) {
		this.imageFile = <File>event.target.files[0];

		const fd = new FormData();
		fd.append('image', this.imageFile, this.imageFile.name.toString());
		fd.append('employee_Id', this.employeeDsiaplay.id.toString());
		this.service.changeEmployeeImageData(fd).
			subscribe(
				(data: HttpReponseModel) => {

					if (data.isSuccess) {
						this.toaster.openSuccessSnackBar(data.message);
						console.log(data.data);
						this.employeeDsiaplay.imagePath = `${localStorage.getItem('companyLink')}${data.data}`
						console.log(this.employeeDsiaplay.imagePath);
						//	this.service.bSubject.next(true);
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

	employeeSelectListOnChange(selectedItem: LookUpModel) {
		this.getEmployeeById(selectedItem.Id);
	}

	getEmployeeById(employee_Id: number) {
		this.service.getEmployeeById(employee_Id)
			.pipe(
				map(
					(data: IEmployee) => ({ ...data, imagePath: `${localStorage.getItem("companyLink")}${data.imagePath}`, imagepathbase: data.imagePath }) as IEmployee
				)
			)
			.subscribe(
				(data: IEmployee) => {

					setTimeout(() => {
						document.getElementById("blocksdisplay")?.click();
						document.getElementById("notfound")?.click();
						document.getElementById("blocksdisplay")?.click();
					}, 200);
					this.employeeDsiaplay = data;
				}
				, (error) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				}
			);
	}

	editEmployeeTechnicialData(value: ITechnitianLog) {

		this.employeeDsiaplay.techTechnician = { employee_Id: 0, id: 0, isActive: false, returnFromBill: false, useGps: false };
		this.employeeDsiaplay.isTechnician = true;
		this.employeeDsiaplay.techTechnician.employee_Id = value.employeeId;
		this.employeeDsiaplay.techTechnician.isActive = true;
		this.employeeDsiaplay.techTechnician.returnFromBill = value.returnFromBill;
		this.employeeDsiaplay.techTechnician.useGps = value.useGps;
	}

	editActiveProp(value: boolean) {
		this.employeeDsiaplay.isActive = value;
	}

	openDialogForEmployee() {
		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(AddTechnitianLogComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position: dialogPosition,
				data: { employeeId: this.employeeDsiaplay.id }
			});

		dialogRef.afterClosed().subscribe((result: ITechnitianLog) => {
			if (result.employeeId !== undefined) {
				this.employeeDsiaplay.isTechnician = true;
				this.editEmployeeTechnicialData(result);
			}
			else {
				this.employeeDsiaplay.isTechnician = false;
			}
		});

	}

	openDialogUpsertEmployee(value: 'ADD' | 'EDIT') {

		if (value == 'ADD') {
			this.employeeDsiaplay = { id: 0, imagePath: '', imagepathbase: '' } as IEmployee;
		}

		console.log(this.employeeDsiaplay.id);
		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(EmployeeUpsertComponent,
			{
				maxHeight: '100vh',
				height: '100%',

				position: dialogPosition,
				data: { employeeId: this.employeeDsiaplay.id, branch_Id: this.branch_Id }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

	openDialog() {
		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(AddTechnitianLogComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position: dialogPosition,
				data: { employeeId: this.employeeDsiaplay.id }
			});

		dialogRef.afterClosed().subscribe((result: ITechnitianLog) => {
			if (result.employeeId !== undefined) {
				this.employeeDsiaplay.isTechnician = true;
				this.editEmployeeTechnicialData(result);
			}
			else {
				this.employeeDsiaplay.isTechnician = false;
			}
		});

	}

}
