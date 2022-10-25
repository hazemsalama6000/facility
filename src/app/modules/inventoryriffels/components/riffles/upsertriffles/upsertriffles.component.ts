import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
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
import { RifflesService } from '../../../services/riffles.service';

@Component({
  selector: 'app-upsertriffles',
  templateUrl: './upsertriffles.component.html',
  styleUrls: ['./upsertriffles.component.scss']
})
export class UpsertrifflesComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<IItemProfile>;
  displayedColumns: string[] = ['n', 'itemCode', 'itemName', 'quantity'];
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
  page = { PNum: 1, PSize: 5 }
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
    private activatedRoute: ActivatedRoute
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

    activatedRoute.queryParams.subscribe(res => {
      if (res.id) {
        rifflesService.getRiffleById(res.id).subscribe(res => {

          this.dataSource = new MatTableDataSource<IRiffle>([]);
          this.dataSource.paginator = this.paginator;

        })
        console.log('params!!!!!!!!!!')
      } else {
        this.dataSource = new MatTableDataSource<IRiffle>([]);
        this.dataSource.paginator = this.paginator;
      }
    })


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
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
    this.rifflesService.getCommmittee().subscribe(res => this.dropdownRiffles = res);
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {
    if (this.masterForm.valid) {
      this.isReadOnly = true;

      this.autoCompleteItems = []
      if (text.length > 3) {
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
          let index = this.dataSource.data.findIndex((x: any) => x.id == res.id);
          if (index > -1)
            this.toaster.openWarningSnackBar('هذا الصنف تم اضاقته من قبل')
          else {
            let item: IItemRiffles = {} as IItemRiffles;

            item.id = 0;
            item.itemData_Id = res.id;
            item.name = res.name;
            item.code = res.code;
            item.countingProcess_Id = 0;

            item.itemsConversion = [];
            res.convertedUnits.map(c => {
              let units: IUnitConversionRiffles = {} as IUnitConversionRiffles;
              units.id = 0;
              units.stockQuantity = c.quantityInExcutedUnit;
              units.itemConversion_Id = c.unitConversionId;
              units.countingItem_Id = 0;
              units.unitName = c.convertedUnitName
              item.itemsConversion.push(units);
            });

            this.dataSource.data.push(item);
            this.dataSource.paginator = this.paginator;
            this.table.renderRows();
            console.log(this.dataSource.data)
          }

        }
        this.itemLoader = false;
      }, (err) => { this.toaster.openWarningSnackBar(err); this.itemLoader = false; })
    }
  }

  addRiffle() {

    let obj = this.createObject(this.dataSource.data as IItemRiffles[]);
    console.log(obj, this.finalSave)
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
          this.toaster.openWarningSnackBar(error.message.toString().replace("Error:", ""));
        }
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
      item.countingProcess_Id = x.countingProcess_Id;

      item.itemsConversion = [];
      x.itemsConversion.map(c => {
        let units: IUnitConversionAddRiffles = {} as IUnitConversionAddRiffles;
        units.id = c.id;
        units.countingQuantity = c.countingQuantity ?? 0;
        units.stockQuantity = c.stockQuantity;
        units.itemConversion_Id = c.itemConversion_Id;
        units.countingItem_Id = c.countingItem_Id;
        item.itemsConversion.push(units);
      });

      riffle.items.push(item);
    });


    return riffle;
  }


  restrictZero(event: any) {
    console.log(event.target.value.startsWith("00"), event.target.value)
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

const x = {
  "id": 0,
  "number": 3,
  "date": "2022-10-23T04:27:56",
  "stock_Id": 13,
  "financialYear_Id": 21,
  "isCountingPartial": false,
  "finalSave": false,
  "items": [{
    "id": 0,
    "itemData_Id": 18,
    "countingProcess_Id": 0,
    "itemsConversion": [{
      "id": 0,
      "countingQuantity": 12,
      "stockQuantity": 1100,
      "itemConversion_Id": 18,
      "countingItem_Id": 0
    }, {
      "id": 0,
      "countingQuantity": 22,
      "stockQuantity": 91.66666666666667,
      "itemConversion_Id": 24,
      "countingItem_Id": 0
    }, {
      "id": 0,
      "countingQuantity": 5,
      "stockQuantity": 11,
      "itemConversion_Id": 25,
      "countingItem_Id": 0
    }]
  }]
}
