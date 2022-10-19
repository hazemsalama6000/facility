import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IReservedItem } from '../../models/IReservedItem.interface';
import { IUpdateReserved } from '../../models/IUpdateReserved.interface';
import { InvTransactionService } from '../../services/invTransaction.service';

@Component({
  selector: 'app-reserveditem',
  templateUrl: './reserveditem.component.html',
  styleUrls: ['./reserveditem.component.scss']
})
export class ReserveditemComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'docNumber', 'docDate', 'itemCode', 'itemName', 'price', 'remainingQuantity', 'reservedQuantity'];
  dataSource: any;
  isLoadingResults = false;
  isRateLimitReached = false;
  dropdownStock: LookUpModel[] = [];
  searchModel: any = { itemId: 0 }
  page = { PNum: 1, PSize: 10 }
  userData: IUserData;
  showbtn: number = 0;
  private unsubscribe: Subscription[] = [];

  constructor(
    private invTransactionService: InvTransactionService,
    private inventoryService: InventoryService,
    private itemService: ItemService,
    private auth: AuthService,
    private toast: toasterService
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  getTransactionData() {
    if (this.searchModel.itemId != 0 && this.searchModel.stockId != 0) {
      this.isLoadingResults = true
      this.invTransactionService.getItemTransactions(this.searchModel.itemId, this.searchModel.stockId).subscribe(res => {
        this.showbtn = res.length;
        this.dataSource = new MatTableDataSource<IReservedItem>(res);
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      })
    }
  }

  fillDropdown() {
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {
    this.autoCompleteItems = []
    if (text.length > 3) {
      this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => this.autoCompleteItems = res);
    } else if (this.searchModel.ItemId) {
      this.searchModel.itemId = 0;
      this.getTransactionData();
    } else
      this.searchModel.itemId = 0;

  }

  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';

  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    this.searchModel.itemId = x.option.value.Id;
    this.getTransactionData();
    console.log(x.option.value)
  }

  updateReservedQuantity() {
    if (!this.dataSource) {
      this.toast.openWarningSnackBar('لايوجد عناصر للحفظ');
      return;
    }

    let data: IUpdateReserved[] = [];
    let isclear = false;
    this.dataSource.data.map((x: any) => {
      if (x.reservedQuantity > x.remainingQuantity) {
        isclear = true;
        return;
      } else
        data.push({ reservedQuantity: x.reservedQuantity, stockTransDetailsId: x.id })
    })

    if (isclear) {
      this.toast.openWarningSnackBar('لا يمكن حجز كمية اكبر من الكمية المتاحة');
      return;
    }

    if (data.length > 0 && !isclear) {
      this.isLoadingResults = true;

      this.invTransactionService.updateReserved(data).subscribe(
        (data: HttpReponseModel) => {
          this.isLoadingResults = false;
          if (data.isSuccess) {
            this.getTransactionData();
            this.toast.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toast.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.isLoadingResults = false;
          this.toast.openWarningSnackBar(error.message.toString().replace("Error:", ""));
        }
      );
    }

  }

  restrictZero(event: any) {
    console.log(event.target.value.startsWith("00"),event.target.value)
    if ((event.target.value.length === 1 && event.key === '0'&&event.target.value.startsWith("0")) || event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e') {
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



