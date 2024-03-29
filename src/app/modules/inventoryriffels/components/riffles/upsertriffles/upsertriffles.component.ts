import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { IItemProfile } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IAddRiffles, IItemAddRiffles, IUnitConversionAddRiffles } from '../../../models/IAddRiffles.interface';
import { IItemRiffles, IRiffle, IUnitConversionRiffles } from '../../../models/IRiffle.interface';
import { IRiffles } from '../../../models/IRiffles.interface';
import { RifflesService } from '../../../services/riffles.service';

@Component({
  selector: 'app-upsertriffles',
  templateUrl: './upsertriffles.component.html',
  styleUrls: ['./upsertriffles.component.scss']
})
export class UpsertrifflesComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<IItemProfile>;
  displayedColumns: string[] = ['n', 'itemCode', 'itemName', 'quantity', 'action'];
  dataSource: any;
  finalSave: boolean = false;
  loading: boolean = false;
  itemLoader = false;
  searchItem: string;
  isReadOnly: boolean = false;
  saveButtonClickedFlag: boolean = false;
  dropdownStock: LookUpModel[] = [];
  dropdownRiffles: LookUpModel[] = [];
  searchModel: any = { itemId: 0 }
  page = { PNum: 1, PSize: 20 }
  maxDate = new Date();
  userData: IUserData;
  showbtn: number = 0;
  // items: IItemProfile[] = [];
  // item: IRiffle = {} as IRiffle;
  private unsubscribe: Subscription[] = [];

  masterForm: FormGroup = this.fb.group({
    id: [0],
    number: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    date: [new Date(), Validators.compose([Validators.required])],
    stock_Id: [null, Validators.compose([Validators.required])],
    commmittee_Id: [null, Validators.compose([Validators.required])],
    financialYear_Id: [''],
    isCountingPartial: [false]
  });

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private itemService: ItemService,
    private auth: AuthService,
    private financialyearService: FinancialyearService,
    private rifflesService: RifflesService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<UpsertrifflesComponent>,
    private toaster: toasterService,
    @Inject(MAT_DIALOG_DATA) public data: { model: IRiffles }
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

    if (data.model) {
      rifflesService.getRiffleById(data.model.id).subscribe(res => {
        this.masterForm.patchValue({
          id: res.id,
          number: res.number,
          date: res.date,
          stock_Id: res.stock_Id,
          commmittee_Id: res.commmittee_Id,
          financialYear_Id: res.financialYear_Id,
          isCountingPartial: res.isCountingPartial
        });
        this.isReadOnly = true;
        this.dataSource = new MatTableDataSource<IItemRiffles>(res.items);
        this.dataSource.paginator = this.paginator;
      })
    } else {
      this.dataSource = new MatTableDataSource<IItemRiffles>([]);
      this.dataSource.paginator = this.paginator;
    }



  }

  ngOnInit(): void { }

  onChangeDate() {
    let date: string = this.masterForm.get('date')?.value as string;
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
    // let financialYear_Id: number = this.masterForm.get('financialYear_Id')?.value
    // let stockId: number = this.masterForm.get('stock_Id')?.value
    // let transTypeId: number = this.masterForm.get('stockTransType_Id')?.value
    // if (financialYear_Id > 0 && stockId > 0 && transTypeId > 0) {
    //   this.invTransactionService.getDocumentNumber(financialYear_Id, stockId, transTypeId).subscribe(res => {
    //     this.masterForm.patchValue({ documentNumber: res.data.docId })
    //   });
    // }
  }

  fillDropdown() {
    this.inventoryService.getLookUpStocks(this.userData.branchId, 0, this.userData.employeeId).subscribe(res => this.dropdownStock = res);
    this.rifflesService.getCommmittee().subscribe(res => this.dropdownRiffles = res);
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {
    if (this.masterForm.valid) {
      this.isReadOnly = true;

      this.autoCompleteItems = []
      if (text.length > 2) {
        this.itemLoader = true
        this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => {
          if (res)
            this.autoCompleteItems = res
          this.itemLoader = false;
        });
      }

    } else
      this.toaster.openWarningSnackBar('برجاء استكمال البيانات الاساسية أولاً')
  }

  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';
  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    if (x.option.value.Id) {
      this.itemLoader = true;
      this.itemService.getItemProfile(x.option.value.Id, this.masterForm.get('stock_Id')?.value, this.userData.companyId).subscribe(res => {
        if (res) {

          let index = this.dataSource.data.findIndex((x: any) => x.itemData_Id == res.id);
          //console.log(this.dataSource.data, res)
          if (index > -1)
            this.toaster.openWarningSnackBar('هذا الصنف تم اضاقته من قبل')
          else {
            let item: IItemRiffles = {} as IItemRiffles;

            item.id = 0;
            item.itemData_Id = res.id;
            item.itemName = res.name;
            item.itemCode = res.code;
            item.totalStockQuantityByBaseUnit = res.quantityInBaseUnit;
            item.countingProcess_Id = 0;

            item.itemsConversion = [];
            res.convertedUnits.map(c => {
              if (c.isBaseUnit) {
                item.baseUnitConversion_Id = c.unitConversionId;
              }

              let units: IUnitConversionRiffles = {} as IUnitConversionRiffles;
              units.id = 0;
              units.stockQuantity = c.quantityReminigOfUnits;
              units.itemConversion_Id = c.unitConversionId;
              units.countingItem_Id = 0;
              units.conversionName = c.convertedUnitName;
              units.factor = c.factor;
              item.itemsConversion.push(units);
            });



            this.dataSource.data.splice(0, 0, item);
            this.dataSource.paginator = this.paginator;
            this.table.renderRows();
          }

        }
        this.itemLoader = false;
      }, (err) => { this.toaster.openWarningSnackBar(err); this.itemLoader = false; })
    }
  }

  deleteItem(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
  }

  addRiffle() {

    let obj = this.createObject(this.dataSource.data as IItemRiffles[]);
    //console.log(obj, this.finalSave)
    console.log(JSON.stringify(obj))

    if (obj.items.length == 0) {
      this.toaster.openWarningSnackBar('لا يوجد اصناف للحفظ')
      return;
    }

    if (this.masterForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.rifflesService.addRiffle(obj).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            this.rifflesService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error)
          if(error.data)
          this.toaster.openWarningSnackBar(error.message);
          else
          this.toaster.openWarningSnackBar(error);        }
      );
    }

  }

  createObject(items: IItemRiffles[]) {

    let riffle: IAddRiffles = {} as IAddRiffles;

    riffle.id = this.masterForm.get('id')?.value;
    riffle.number = this.masterForm.get('number')?.value + '';
    riffle.date = this.datePipe.transform(new Date().setDate(new Date(this.masterForm.get('date')?.value).getDate()), 'yyyy-MM-ddThh:mm:ss') ?? '';
    riffle.stock_Id = this.masterForm.get('stock_Id')?.value;
    riffle.financialYear_Id = this.masterForm.get('financialYear_Id')?.value;

    riffle.isCountingPartial = this.masterForm.get('isCountingPartial')?.value;

    riffle.commmittee_Id = this.masterForm.get('commmittee_Id')?.value;
    riffle.finalSave = this.finalSave;
    riffle.items = [];
    items.map(x => {
      let item: IItemAddRiffles = {} as IItemAddRiffles;
      item.id = x.id;
      item.itemData_Id = x.itemData_Id;
      item.totalStockQuantityByBaseUnit = x.totalStockQuantityByBaseUnit;

      item.baseUnitConversion_Id = x.baseUnitConversion_Id;
      item.totalCountingQuantityByBaseUnit = 0;
      item.isIncreaseSettlement = null;
      item.countingProcess_Id = x.countingProcess_Id;

      item.itemsConversion = [];
      x.itemsConversion.map((c, index) => {
        if (isNaN(c.countingQuantity))
          c.countingQuantity = 0;

        let units: IUnitConversionAddRiffles = {} as IUnitConversionAddRiffles;
        units.id = c.id;
        units.countingQuantity = c.countingQuantity;
        units.stockQuantity = c.stockQuantity;
        units.itemConversion_Id = c.itemConversion_Id;
        units.countingItem_Id = c.countingItem_Id;
        units.factor = c.factor;
        item.itemsConversion.push(units);

        item.totalCountingQuantityByBaseUnit += c.countingQuantity * c.factor;
        if ((index + 1) == x.itemsConversion.length) {
          if (item.totalCountingQuantityByBaseUnit == item.totalStockQuantityByBaseUnit)
            item.isIncreaseSettlement = null;
          else if (item.totalCountingQuantityByBaseUnit > item.totalStockQuantityByBaseUnit)
            item.isIncreaseSettlement = true;
          else
            item.isIncreaseSettlement = false;
        }
      });


      riffle.items.push(item);
    });


    return riffle;
  }


  restrictZero(event: any) {
    if ((event.target.value.length === 1 && event.key === '0' && event.target.value.startsWith("0")) || event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

  pageEvent(event: any) {
    this.page.PSize = event.pageSize;
    this.page.PNum = event.pageIndex + 1;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}


