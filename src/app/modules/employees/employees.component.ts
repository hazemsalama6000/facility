import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { AreaService } from 'src/app/core-module/LookupsServices/area.service';
import { BlockService } from 'src/app/core-module/LookupsServices/block.service';
import { BranchService } from 'src/app/core-module/LookupsServices/branch.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { AuthService } from '../auth';
import { IUserData } from '../auth/models/IUserData.interface';
import { IEmployee } from './models/employee.interface';
import { ISearch } from './models/ISearch.interface';
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

	dropdownEmployeeData: LookUpModel[] = [];
	dropdownBranchData: LookUpModel[] = [];
	dropdownAreaData: LookUpModel[] = [];
	dropdownBlockData: LookUpModel[] = [];
	searchModel: ISearch = {} as ISearch;
	employeeDisplay: IEmployee = {} as IEmployee;
	companyId: number;

	constructor(
		private service: EmployeeService,
		private blockService: BlockService,
		private areaService: AreaService,
		private branchService: BranchService,
		private toaster: toasterService,
		public dialog: MatDialog,
		private auth: AuthService) {
	}


	ngOnInit(): void {
		this.getUserDataAndLoadBranchesList();
		this.searchEmployee();
	}

	getUserDataAndLoadBranchesList() {
		this.auth.userData.subscribe((data: IUserData) => {
			this.companyId = data.companyId;
			this.branchService.getLookupBranchData(this.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownBranchData = data;
			});
		});
	}

	clearBranches(){
		this.dropdownEmployeeData = [];
		this.dropdownAreaData = [];
		this.dropdownBlockData = [];
	}
	clearArea(){
		this.dropdownEmployeeData = [];
		this.dropdownBlockData = [];
	}
	clearBlocks(){
		this.dropdownEmployeeData = [];
	}

	branchSelectListOnChange(selectedItem: LookUpModel) {
		this.areaService.getLookupAreaData(selectedItem.Id)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownAreaData = data;
				}
			);
		this.searchModel.branchId = selectedItem.Id;
		this.searchEmployee();
	}

	areaSelectListOnChange(selectedItem: LookUpModel) {
		this.blockService.getLookupBlockData(selectedItem.Id)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownBlockData = data;
				}
			);
		this.searchModel.AreaId = selectedItem.Id;
		this.searchEmployee();
	}


	blockSelectListOnChange(selectedItem: LookUpModel) {
		this.searchModel.Block = selectedItem.Id;
		this.searchEmployee();
	}

	searchEmployee() {
		this.service.getLookupEmployeeDataByParam(this.searchModel)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownEmployeeData = data;
				}
			);
	}

	employeeSelectListOnChange(selectedItem: LookUpModel) {
		this.service.getEmployeeById(selectedItem.Id)
			.subscribe(
				(data: IEmployee) => {
					this.employeeDisplay = data;
					this.service.currentEmployeeSelected = data;
					this.service.subjectEmployeeChanged.next(true);
					
					setTimeout(() => {
						document.getElementById("blocksdisplay")?.click();		
					}, 1000);

					console.log(this.employeeDisplay);
				}
				, (error) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
				}
			);
	}


	editEmployeeTechnicialData(value: ITechnitianLog) {
		this.employeeDisplay.technician = {
			employeeId: 0
			, id: 0
			, isActive: false
			, attachImageEditCustomer: false
			, attachImageRead: false
			, canCollect: false
			, canComplain: false
			, canEditCustomer: false
			, canRead: false
			, maxOfflineWorkingBills: 0
			, maxOfflineWorkingHours: 0
			,insertDate:new Date(),
			updateDate:new Date()
		};

		this.employeeDisplay.isTechnician = true;
		this.employeeDisplay.technician.employeeId = value.employeeId;
		this.employeeDisplay.technician.isActive = true;
		this.employeeDisplay.technician.attachImageEditCustomer = value.attachImageEditCustomer;
		this.employeeDisplay.technician.attachImageRead = value.attachImageRead;
		this.employeeDisplay.technician.canCollect = value.canCollect;
		this.employeeDisplay.technician.canComplain = value.canComplain;
		this.employeeDisplay.technician.canEditCustomer = value.canEditCustomer;
		this.employeeDisplay.technician.canRead = value.canRead;
		this.employeeDisplay.technician.maxOfflineWorkingBills = value.maxOfflineWorkingBills;
		this.employeeDisplay.technician.maxOfflineWorkingHours = value.maxOfflineWorkingHours;
	}

	editActiveProp(value: boolean) {
		this.employeeDisplay.userIsActive = value;
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
				data: { employeeId: this.employeeDisplay.id }
			});

		dialogRef.afterClosed().subscribe((result: ITechnitianLog) => {
			if (result.employeeId !== undefined) {
				this.employeeDisplay.isTechnician = true;
				this.editEmployeeTechnicialData(result);
			}
			else {
				this.employeeDisplay.isTechnician = false;
			}
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
				data: { employeeId: this.employeeDisplay.id }
			});

		dialogRef.afterClosed().subscribe((result: ITechnitianLog) => {
			if (result.employeeId !== undefined) {
				this.employeeDisplay.isTechnician = true;
				this.editEmployeeTechnicialData(result);
			}
			else {
				this.employeeDisplay.isTechnician = false;
			}
		});

	}

}
