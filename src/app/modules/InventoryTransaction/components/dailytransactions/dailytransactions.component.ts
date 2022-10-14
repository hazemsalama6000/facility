import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { CarService } from 'src/app/modules/car/services/cars.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { DepartmentService } from 'src/app/modules/share/Services/department_section/department.service';
import { VendorService } from 'src/app/modules/vendor/services/vendor.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IEntityType } from '../../models/IEntityType.interface';
import { IInvTransaction } from '../../models/IInvTransaction.interface';
import { ISeachTransaction } from '../../models/ISeachTransaction.interface';
import { ITransType } from '../../models/ITransType.interface';
import { InvTransactionService } from '../../services/invTransaction.service';
import { AddtransactionComponent } from './addtransaction/addtransaction.component';

@Component({
  selector: 'app-dailytransactions',
  templateUrl: './dailytransactions.component.html',
  styleUrls: ['./dailytransactions.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DailytransactionsComponent implements OnInit {

  columnsToDisplay = [ 'docNumber', 'docDate', 'transType', 'stockName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IInvTransaction | null;

  data: any[] = [];
  totalRecord = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchModel: ISeachTransaction = { CompanyBranchId: 0, PageNumber: 1, PageSize: 5, };

  dropdownEntity: LookUpModel[] = [];
  dropdownTransType: ITransType[] = [];
  dropdownEntityType: IEntityType[] = [];
  dropdownStock: LookUpModel[] = [];
  entityTypeObject: IEntityType | null;

  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private invTransactionService: InvTransactionService,
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private itemService: ItemService,
    private carService: CarService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.CompanyBranchId = data.branchId;
      this.fillDropdown();
      let subTrans = invTransactionService.bSubject.subscribe(res => this.getTransactionData());
      this.unsubscribe.push(subTrans);
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  getTransactionData() {
    this.searchModel.StartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00" ?? '';
    this.searchModel.EndDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00" ?? '';
    this.invTransactionService.getTransaction(this.searchModel).subscribe(res => {
      this.data = res.data;
      this.isLoadingResults = false;
      this.totalRecord = res.totalRecords;
    })
  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getTransactionData();
  }

  fillDropdown() {
    this.invTransactionService.getTransactionType().subscribe(res => { this.dropdownTransType = res });
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
  }

  getTransactionByCode = (text: string) => {
    let val: number = parseInt(text);
    (!isNaN(val)) ? this.searchModel.DocNumber = val : delete this.searchModel.DocNumber;
    this.getTransactionData();
  }

  onSelectTransType(item: ITransType) {
    if (item) {
      this.invTransactionService.getEntityType(item.id).subscribe(res => this.dropdownEntityType = res);
    }
  }


  onSelectEntityType(item: IEntityType) {
    delete this.searchModel.VendorId;
    delete this.searchModel.EmployeeId;
    delete this.searchModel.DepartmentId;
    delete this.searchModel.CarId;
    delete this.searchModel.ExternalVendorId;
    delete this.searchModel.StockId;
    if (item) {
      switch (item.sysName) {
        case 'vendor':
          this.vendorService.getLookUpVendor(this.userData.companyId).subscribe(res => this.dropdownEntity = res);
          break;
        case 'employee':
          this.employeeService.getLookupEmployeeData(this.userData.companyId, this.userData.branchId).subscribe(res => this.dropdownEntity = res);
          break;
        case 'department':
          this.departmentService.getLookupData(this.userData.companyId).subscribe(res => this.dropdownEntity = res);
          break;
        case 'car':
          this.carService.getLookupCarData(this.userData.branchId).subscribe(res => this.dropdownEntity = res);
          break;
        case 'external':
          this.invTransactionService.getExternalPlaces(this.userData.companyId).subscribe(res => this.dropdownEntity = res);
          break;
        case 'stock':
          this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownEntity = res);
          break;
        default:
          break;
      }
    }
  }

  onSelectEntity(item: LookUpModel) {

    delete this.searchModel.VendorId;
    delete this.searchModel.EmployeeId;
    delete this.searchModel.DepartmentId;
    delete this.searchModel.CarId;
    delete this.searchModel.ExternalVendorId;
    delete this.searchModel.StockId;

    if (this.entityTypeObject && item) {

      switch (this.entityTypeObject.sysName) {
        case 'vendor':
          this.searchModel.VendorId = item.Id;
          break;
        case 'employee':
          this.searchModel.EmployeeId = item.Id;
          break;
        case 'department':
          this.searchModel.DepartmentId = item.Id;
          break;
        case 'car':
          this.searchModel.CarId = item.Id;
          break;
        case 'external':
          this.searchModel.ExternalVendorId = item.Id;
          break;
        case 'stock':
          this.searchModel.StockId = item.Id;
          break;
        default:
          break;
      }
    }

    this.getTransactionData();
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {
    this.autoCompleteItems = []
    if (text.length > 3) {
      this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => this.autoCompleteItems = res);
    } else if (this.searchModel.ItemId) {
      delete this.searchModel.ItemId;
      this.getTransactionData();
    } else
      delete this.searchModel.ItemId;
  }

  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';

  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    this.searchModel.ItemId = x.option.value.Id;
    this.getTransactionData();
  }


  openDialog() {
    this.dialog.open(AddtransactionComponent, {
      minWidth: '100%',
      height: '100vh',
      position: { right: '0' }
    })
  }


  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());

}
