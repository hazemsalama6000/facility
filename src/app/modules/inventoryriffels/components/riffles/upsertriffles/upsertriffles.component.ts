import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { IItemProfile } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';

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
  loading:boolean=false;
  itemLoader = false;
  searchItem: string;
  isReadOnly: boolean = false;
  saveButtonClickedFlag: boolean = false;
  dropdownStock: LookUpModel[] = [];
  searchModel: any = { itemId: 0 }
  page = { PNum: 1, PSize: 5}
  maxDate = new Date();
  userData: IUserData;
  showbtn: number = 0;
  items: IItemProfile[] = [];
  item: IItemProfile = {} as IItemProfile;
  private unsubscribe: Subscription[] = [];

  masterForm: FormGroup = this.fb.group({
    stock_Id: [null, Validators.compose([Validators.required])],
    documentDate: [new Date(), Validators.compose([Validators.required])],
    documentNumber: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    committee_Id: [''],
    financialYear_Id: ['']
  });

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private itemService: ItemService,
    private auth: AuthService,
    private financialyearService: FinancialyearService,
    private datePipe: DatePipe,
    private toaster: toasterService
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);
    this.dataSource = new MatTableDataSource<IItemProfile>([]);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void { }

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
          else {
            this.item = {} as IItemProfile;
          }
          this.itemLoader = false;
        });

      } else {
        this.item = {} as IItemProfile;
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
          this.item = res;
          let index = this.dataSource.data.findIndex((x: any) => x.id == res.id);
          if (index > -1)
            this.toaster.openWarningSnackBar('هذا الصنف تم اضاقته من قبل')
          else {
            this.dataSource.data.push(res);
            this.dataSource.paginator = this.paginator;
            this.table.renderRows();
          }

        }
        this.itemLoader = false;
      }, (err) => { this.toaster.openWarningSnackBar(err); this.itemLoader = false; })
    }
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
