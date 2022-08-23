import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AreaService } from "src/app/core-module/LookupsServices/area.service";
import { BlockService } from "src/app/core-module/LookupsServices/block.service";
import { BranchService } from "src/app/core-module/LookupsServices/branch.service";
import { UpdateTypeService } from "src/app/core-module/LookupsServices/updateType.service";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CutomerService } from "src/app/modules/customers/services/customer.service";
import { ISearch } from "src/app/modules/employees/models/ISearch.interface";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ICustomerEditManageSearch } from "../../models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { ICustomerEditResponse } from "../../models/cutomer-editmanage/ICustomerEditResponse.interface";
import { customerUpdateManageService } from "../../services/customer-update-manage.service";
import { ItemsWithPages } from "./update-datatable/update-datatable.component";


@Component({
	selector: 'customer-update-manage',
	templateUrl: './customer-update-manage.component.html',
	styleUrls: ['./customer-update-manage.component.scss'],
})

export class CustomerUpdateManageComponent implements OnInit {
	dropdownEmployeeData: LookUpModel[] = [];
	dropdownCustomerData: LookUpModel[] = [];
	dropdownBranchData: LookUpModel[] = [];
	dropdownAreaData: LookUpModel[] = [];
	dropdownBlockData: LookUpModel[] = [];
	dropdownUpdateTypeData: LookUpModel[] = [];
	customerEditSearchForm: FormGroup;
	searchModel: ICustomerEditManageSearch = {} as ICustomerEditManageSearch;

	constructor(
		private customerEditManageService: customerUpdateManageService,
		private service: EmployeeService,
		private customerService: CutomerService,
		private blockService: BlockService,
		private areaService: AreaService,
		private branchService: BranchService,
		private updateTypeService: UpdateTypeService,
		private toaster: toasterService, private fb: FormBuilder,
		private auth: AuthService, private datePipe: DatePipe) {
	}

	ngOnInit(): void {
		this.customerEditSearchForm = this.fb.group({
			CustomerCode: [0],
			BranchId: [],
			AreaId: [],
			BlockId: [],
			CustomerId: [],
			Employee_id: [],
			StartDate: [new Date().toISOString()],
			EndDate: [new Date().toISOString()],
			UpdatingTypeId: [],
		});

		this.auth.userData.subscribe((data: IUserData) => {
			this.branchService.getLookupBranchData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownBranchData = data;
			});

			this.updateTypeService.getLookupUpdateTypeData(data.companyId).subscribe((data: LookUpModel[]) => {
				this.dropdownUpdateTypeData = data;
			});
		});

	}
	ngAfterViewInit(): void {
		this.getCustomerDataByCode('');
	}
	searchCustomerEdits(model: ICustomerEditManageSearch) {
		model.StartDate = this.datePipe.transform(model.StartDate, 'MM/dd/yyyy')!;
		model.EndDate = this.datePipe.transform(model.EndDate, 'MM/dd/yyyy')!;
	
		this.customerEditManageService.searchParameterAction.next(model);
		this.customerEditManageService.searchUpdateUserManageAction.next(true);
	
	}

	getCustomerDataByCode(customerCode: string) {

		let model: ICustomerEditManageSearch = { AreaId: 0, BlockId: 0, BranchId: 0, CustomerCode: customerCode, CustomerId: 0, Employee_id: 0 } as ICustomerEditManageSearch;
		this.customerEditManageService.searchParameterAction.next(model);
		this.customerEditManageService.searchUpdateUserManageAction.next(true);
	}

	branchSelectListOnChange(selectedItem: LookUpModel) {
		this.areaService.getLookupAreaData(selectedItem.Id)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownAreaData = data;
				}
			);
		this.searchModel.BranchId = selectedItem.Id;
		this.searchEmployeeAndCustomer();
	}

	areaSelectListOnChange(selectedItem: LookUpModel) {
		this.blockService.getLookupBlockData(selectedItem.Id)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownBlockData = data;
				}
			);
		this.searchModel.AreaId = selectedItem.Id;
		this.searchEmployeeAndCustomer();
	}


	blockSelectListOnChange(selectedItem: LookUpModel) {
		this.searchModel.BlockId = selectedItem.Id;
		this.searchEmployeeAndCustomer();
	}

	searchEmployeeAndCustomer() {
		let search: ISearch = { branchId: this.searchModel.BranchId, AreaId: this.searchModel.AreaId, Block: this.searchModel.BlockId };
		let searchCustomer: any = { AreaId: this.searchModel.AreaId, Block: this.searchModel.BlockId, branchId: this.searchModel.BranchId, employeeId: this.searchModel.Employee_id }

		this.service.getLookupEmployeeDataByParam(search)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownEmployeeData = data;
				}
			);

		this.customerService.getLookupCustomerDataByParam(searchCustomer)
			.subscribe(
				(data: LookUpModel[]) => {
					// console.log(data);
					this.dropdownCustomerData = data;
				}
			);
	}

	employeeSelectListOnChange(selectedItem: LookUpModel) {
		this.searchCustomerByEmployee(selectedItem.Id);
	}

	searchCustomerByEmployee(employeeId: number) {
		this.customerService.getLookupCutomerDataByEmployee(employeeId)
			.subscribe(
				(data: LookUpModel[]) => {
					this.dropdownCustomerData = data;
				}
			);
	}



}