import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CarService } from 'src/app/modules/car/services/cars.service';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { IConvertedUnits, IItemProfile } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { DepartmentService } from 'src/app/modules/share/Services/department_section/department.service';
import { VendorService } from 'src/app/modules/vendor/services/vendor.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IAddTransaction, IItem, ITransEntity } from '../../../models/IAddTransaction.interface';
import { IEntityType } from '../../../models/IEntityType.interface';
import { ITransType } from '../../../models/ITransType.interface';
import { InvTransactionService } from '../../../services/invTransaction.service';
import { AddserialsComponent } from './addserials/addserials.component';

@Component({
  selector: 'app-addtransaction',
  templateUrl: './addtransaction.component.html',
  styleUrls: ['./addtransaction.component.scss']
})
export class AddtransactionComponent implements OnInit, OnDestroy {

  @ViewChild('TransType') TransTypes!: any;
  loading: boolean = false;
  saveButtonClickedFlag: boolean = false;
  dropdownTransType: ITransType[] = [];
  TransType: ITransType = { id: 0, name: '', transKind: true, sysName: '' };
  dropdownStock: LookUpModel[] = [];
  dropdownEntityType: IEntityType[] = [];
  EntityType: IEntityType = { id: 0, name: '', sysName: '' };
  dropdownEntity: LookUpModel[] = [];
  searchItem: string;
  maxDate = new Date();

  convertedUnits: IConvertedUnits[] = [];
  convertedUnit: IConvertedUnits;

  items: IItemProfile[] = [];
  item: IItemProfile = {} as IItemProfile;

  userData: IUserData;
  unsubscribe: Subscription[] = [];
  isReadOnly: boolean = false

  masterForm: FormGroup = this.fb.group({
    stock_Id: [null, Validators.compose([Validators.required])],
    stockTransType_Id: [null, Validators.compose([Validators.required])],
    documentDate: [new Date(), Validators.compose([Validators.required])],
    documentNumber: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    notes: [''],
    entityType_Id: [null, Validators.compose([Validators.required])],
    entity_Id: [null, Validators.compose([Validators.required])],
    financialYear_Id: [null],
    billVendorNumber: [null],
  });

  detailsForm: FormGroup = this.fb.group({
    name: [''],
    price: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
    quantity: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    unit: [{ value: null, disabled: true }, Validators.compose([Validators.required])]
  });

  constructor(
    private fb: FormBuilder,
    private invTransactionService: InvTransactionService,
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private financialyearService: FinancialyearService,
    private itemService: ItemService,
    private carService: CarService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private toaster: toasterService,
    private dialogRef: MatDialogRef<AddtransactionComponent>,
    private dialog: MatDialog) {

    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

    // this.items = JSON.parse(localStorage.getItem('Items') as string);
    // let masterData: any = JSON.parse(localStorage.getItem('mainData') as string);
    // this.masterForm.patchValue({
    //   stock_Id: masterData.stock_Id,
    //   stockTransType_Id: masterData.stockTransType_Id,
    //   documentDate: masterData.documentDate,
    //   notes: masterData.notes,
    //   entityType_Id: masterData.entityType_Id,
    //   entity_Id: masterData.entity_Id,
    //   financialYear_Id: masterData.financialYear_Id,
    //   documentNumber: masterData.documentNumber,
    // });

  }


  ngOnInit() {
  }

  fillDropdown() {
    this.invTransactionService.getTransactionType().subscribe(res => { this.dropdownTransType = res.filter(x => x.sysName != 'transferfrom'&&x.sysName != 'returnfrom'); });
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
  }

  onSelectTransType(item: ITransType) {
    if (item) {
      this.TransType = item;
      this.invTransactionService.getEntityType(item.id).subscribe(res => {
        this.dropdownEntityType = res;
        this.EntityType = res.find(x => x.sysName == 'stock') ?? { sysName: '' } as IEntityType;

        if (this.TransType.sysName == 'settlementinc' || this.TransType.sysName == 'settlementdec') {
          this.masterForm.patchValue({
            entityType_Id: this.EntityType.id ?? 0,
            entity_Id: this.masterForm.get('stock_Id')?.value
          })
        }
      });


    } else
      this.TransType = {} as ITransType;
  }

  onSelectEntityType(item: IEntityType) {
    if (item) {
      this.EntityType = item;
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
          this.inventoryService.getLookUpStocks(this.userData.branchId, this.masterForm.get('stock_Id')?.value).subscribe(res => this.dropdownEntity = res);
          break;
        default:
          break;
      }
    }
    console.log(item);
  }

  onChangeDate() {
    let date: string = this.masterForm.get('documentDate')?.value as string;
    this.financialyearService.checkFinancialYear(this.userData.companyId, this.datePipe.transform(new Date(date), 'yyyy-MM-dd') + "T00:00:00" ?? '').subscribe(res => {
      if (res.data) {
        this.masterForm.patchValue({ financialYear_Id: res.data.id });
        this.onChangeDateOrStockOrTransType();
      }
    }, (err) => {
      this.toaster.openWarningSnackBar(err);
      this.masterForm.patchValue({ documentDate: '' });
    })
  }

  onChangeDateOrStockOrTransType(x?: number) {
    let financialYear_Id: number = this.masterForm.get('financialYear_Id')?.value
    let stockId: number = this.masterForm.get('stock_Id')?.value
    let transTypeId: number = this.masterForm.get('stockTransType_Id')?.value
    // console.log(financialYear_Id > 0 && stockId > 0 && transTypeId > 0)
    if (financialYear_Id > 0 && stockId > 0 && transTypeId > 0) {
      this.invTransactionService.getDocumentNumber(financialYear_Id, stockId, transTypeId).subscribe(res => {
        this.masterForm.patchValue({ documentNumber: res.data.docId })
      });
    }
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {

    if (this.masterForm.valid) {
      this.isReadOnly = true;
      this.detailsForm.get('price')?.enable();
      this.detailsForm.get('unit')?.enable();
      this.detailsForm.get('quantity')?.enable();

      this.autoCompleteItems = []
      if (text.length > 3) {
        this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => {
          if (res)
            this.autoCompleteItems = res
          else {
            this.item = {} as IItemProfile;
            this.convertedUnit = {} as IConvertedUnits;
            this.convertedUnits = [];
          }
        });

      } else {
        this.item = {} as IItemProfile;
        this.convertedUnit = {} as IConvertedUnits;
        this.convertedUnits = [];
      }
    } else
      this.toaster.openWarningSnackBar('برجاء استكمال البيانات الاساسية أولاً')
  }

  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';
  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    if (x.option.value.Id)
      this.itemService.getItemProfile(x.option.value.Id,this.masterForm.get('stock_Id')?.value, this.userData.companyId).subscribe(res => {
        if (res) {
          this.detailsForm.reset();
          this.item = res;
          this.convertedUnits = res.convertedUnits;
          this.convertedUnit = res.convertedUnits.find(x => x.isBaseUnit) as IConvertedUnits;
          this.detailsForm.patchValue({ unit: this.convertedUnit.unitConversionId });
        }
      }, (err) => this.toaster.openWarningSnackBar(err))
  }

  onSelectUnit(item: IConvertedUnits) {
    console.log(item)
    console.log(this.detailsForm.value)
    this.convertedUnit = item;
  }

  calcQuantity() {

    if (this.item) {
      let quantity = this.detailsForm.get('quantity')?.value;
      let BillQuantity = (quantity * this.convertedUnit.factor);
      if (!isNaN(quantity)) {
        // console.log()
        if (this.TransType.sysName != 'increase') {
          this.invTransactionService.getPrice(quantity, this.item.id, this.masterForm.get('stock_Id')?.value).subscribe(res => {
            if(res.isSuccess)
            this.detailsForm.patchValue({price:res.data.avgPrice});
          })
        }

        if (this.TransType.transKind) {
          let totalQuantity = BillQuantity + this.item.quantityInBaseUnit;
          (totalQuantity > this.item.maxLimit) ? this.toaster.openWarningSnackBar('برجاء الانتباه بأن الكمية تخطى الحد الاقصى') : null;
        } else {
          this.items.filter(x => x.id == this.item.id).map(item => BillQuantity += item.quantity);
          if (BillQuantity > this.item.quantityInBaseUnit) {
            this.toaster.openWarningSnackBar('لا يمكن صرف كمية أكبر من الكمية الموجودة بالمخزن');
            this.detailsForm.get('quantity')?.setErrors({ 'incorrect': true });
          }
        }
      }
    }

  }

  AddItem() {
    if (this.detailsForm.valid) {

      this.item.preconvertedQuantity = this.detailsForm.get('quantity')?.value;

      if (this.item.preconvertedQuantity < 1) {
        this.detailsForm.get('quantity')?.setErrors(Validators.pattern("^[0-9]*$"))
        return;
      }

      if (this.TransType.sysName != "increase") {
        let index = this.items.findIndex(x => x.id == this.item.id);
        if (index > -1) {
          this.toaster.openWarningSnackBar('لايمكن اضافة نفس الصنف');
          return;
        }
      }

      this.item.price = this.detailsForm.get('price')?.value;
      this.item.quantity = this.item.preconvertedQuantity * this.convertedUnit.factor;
      this.item.convertedUnit = this.convertedUnit;
      this.item.total = this.item.quantity * (this.item.price / this.item.convertedUnit.factor);
      this.items.push(this.item);
      this.item = {} as IItemProfile;
      this.convertedUnit = {} as IConvertedUnits;
      this.convertedUnits = [];
      this.detailsForm.reset();
      this.detailsForm.get('price')?.setErrors(null)
      this.detailsForm.get('quantity')?.setErrors(null)
      this.detailsForm.get('unit')?.setErrors(null)
      this.searchItem = '';
    }
  }

  editItem(item: IItemProfile, index: number) {
    this.item = item;
    this.convertedUnits = item.convertedUnits;
    this.convertedUnit = item.convertedUnit;
    this.detailsForm.patchValue({
      unit: item.convertedUnit.unitConversionId,
      quantity: item.preconvertedQuantity,
      price: item.price
    });
    this.items.splice(index, 1);
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
  }

  AddTransaction() {
    if (this.items.length == 0) {
      this.toaster.openWarningSnackBar('لا يوجد اصناف للحفظ')
      return;
    }

    if (this.masterForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      let obj = this.createTransactionObject();
      this.invTransactionService.addTransaction(obj).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            this.invTransactionService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {

          error.data.itemData.map((d: IItem) => {
            let index: number = d.indexRef - 1
            this.items[index].isRefused = d.isRefused ?? false;
          })

          this.loading = false;
          this.toaster.openWarningSnackBar(error.message.toString().replace("Error:", ""));
        }
      );
    }
  }

  createTransactionObject(): IAddTransaction {

    let transaction: IAddTransaction = {} as IAddTransaction;
    transaction.id = 0;
    transaction.companyId = this.userData.companyId;
    transaction.stock_Id = this.masterForm.get('stock_Id')?.value;
    transaction.stockTransType_Id = this.masterForm.get('stockTransType_Id')?.value;
    transaction.documentDate = this.datePipe.transform(new Date().setDate(new Date(this.masterForm.get('documentDate')?.value).getDate()), 'yyyy-MM-ddThh:mm:ss') ?? '';
    transaction.documentNumber = this.masterForm.get('documentNumber')?.value;
    transaction.financialYear_Id = this.masterForm.get('financialYear_Id')?.value;
    transaction.notes = this.masterForm.get('notes')?.value;

    transaction.transEntity = {} as ITransEntity;
    if (this.EntityType) {
      switch (this.EntityType.sysName) {
        case 'vendor':
          transaction.transEntity.vendor_Id = this.masterForm.get('entity_Id')?.value;
          break;
        case 'employee':
          transaction.transEntity.employee_Id = this.masterForm.get('entity_Id')?.value;
          break;
        case 'department':
          transaction.transEntity.department_Id = this.masterForm.get('entity_Id')?.value;
          break;
        case 'car':
          transaction.transEntity.car_Id = this.masterForm.get('entity_Id')?.value;
          break;
        case 'external':
          transaction.transEntity.externalVendor_Id = this.masterForm.get('entity_Id')?.value;
          break;
        case 'stock':
          transaction.transEntity.transferStock_Id = this.masterForm.get('entity_Id')?.value;
          break;
        default:
          break;
      }
    }

    let x = this.masterForm.get('billVendorNumber')?.value;
    transaction.transEntity.stockTransaction_Id = 0;
    transaction.transEntity.entityType_Id = this.masterForm.get('entityType_Id')?.value;
    if (x)
      transaction.transEntity.billVendorNumber = x;

    transaction.itemData = [];
    this.items.map((obj, index) => {
      obj.indexRef = index + 1;
      transaction.itemData.push({
        preConvertedQuantity: obj.preconvertedQuantity,
        quantity: obj.quantity,
        price: obj.price / obj.convertedUnit.factor,
        unitConversion_Id: obj.convertedUnit.unitConversionId,
        stockTransaction_Id: 0,
        itemId: obj.id,
        indexRef: obj.indexRef
      });
    });

    console.log(this.items, transaction)

    return transaction;
  }

  openSerialDialog(item: IItemProfile, index: number) {
    this.dialog.open(AddserialsComponent, {
      minWidth: '40%',
      minHeight: '80vh',
      // position:{right:'0'}
      data: { item: item }
    })
  }


  deleteSubForm() {
    this.items = [];
    this.item = {} as IItemProfile;
    this.isReadOnly = false;
    this.autoCompleteItems=[]
    this.searchItem = '';
    this.detailsForm.get('price')?.disable();
    this.detailsForm.get('unit')?.disable();
    this.detailsForm.get('quantity')?.disable();
  }

  restrictZero(event: any) {
    if ((event.target.value.length === 0 && event.key === '0') || event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

  restrictZeroPrice(event: any) {
    if ((event.target.value.length === 0 && event.key === '0') || event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    // if (this.items.length > 0) {
    //   localStorage.setItem('Items', JSON.stringify(this.items));
    //   localStorage.setItem('mainData', JSON.stringify(this.masterForm.value));
    // }
  }

}

