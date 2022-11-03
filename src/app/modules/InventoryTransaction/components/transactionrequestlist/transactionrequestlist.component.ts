import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IAddTransaction, ITransEntity } from '../../models/IAddTransaction.interface';
import { IInvTransaction, IInvTransactionDetails } from '../../models/IInvTransaction.interface';
import { InvTransactionService } from '../../services/invTransaction.service';

@Component({
  selector: 'app-transactionrequestlist',
  templateUrl: './transactionrequestlist.component.html',
  styleUrls: ['./transactionrequestlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TransactionrequestlistComponent implements OnInit {

  columnsToDisplay = ['n', 'docNumber', 'docDate', 'stockName', 'transType', 'entityName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IInvTransaction | null;
  @ViewChild(MatTable) table: MatTable<IInvTransaction>;
  loading: boolean = false;
  data: any[] = [];
  totalRecord = 0;
  searchModel: any = { CompanyBranchId: 0, stockEmployeeId: 0, PageNumber: 1, PageSize: 5, IsTransferRequest: true };
  isLoadingResults = true;
  isRateLimitReached = false;
  userData: IUserData;
  dropdownStock: LookUpModel[] = [];
  maxDate = new Date();
  startDate: string;
  endDate: string;
  private unsubscribe: Subscription[] = [];

  constructor(
    private invTransactionService: InvTransactionService,
    private auth: AuthService,
    private financialyearService: FinancialyearService,
    private inventoryService: InventoryService,
    private toaster: toasterService,
    private datePipe: DatePipe,
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.CompanyBranchId = data.branchId;
      this.searchModel.stockEmployeeId = data.employeeId;
      let subTrans = invTransactionService.bSubject.subscribe(res => this.getTransactionData());
      this.unsubscribe.push(subTrans);
      this.inventoryService.getLookUpStocks(this.userData.branchId, 0, this.userData.employeeId).subscribe(res => this.dropdownStock = res);

    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  getTransactionData() {
    this.invTransactionService.getTransferFromTransaction(this.searchModel).subscribe(res => {
      res.data.map(x => x.stockTransDetails.map(obj => {
        obj.quantity = obj.baseQuantity / obj.convertedUnits.factor;
        obj.receivedQuantity = obj.quantity;
        obj.remainingQuantity = 0;
      }));
      this.data = res.data;
      this.totalRecord = res.totalRecords;
      this.isLoadingResults = false;
    })
  }

  pageEvent(event: any) {
    console.log(event);
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getTransactionData();
  }

  getTransactionByDate() {
    delete this.searchModel.DocNumber;
    if (this.startDate && this.endDate) {
      this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.searchModel.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.getTransactionData();
    } else {
      this.searchModel.StartDate = '';
      this.searchModel.EndDate = '';
      this.getTransactionData();
    }
  }

  onChangeDate(element: IInvTransaction, elementIndex: number) {

    element.docReceivedNumber = 0;
    this.financialyearService.checkFinancialYear(this.userData.companyId, this.datePipe.transform(new Date(element.docReceivedDate), 'yyyy-MM-dd') + "T00:00:00" ?? '').subscribe(res => {
      if (res.data) {
        element.financialYear_Id = res.data.id;
        this.data[elementIndex].financialYear_Id = res.data.id;
        console.log(element, element.financialYear_Id, element.stockTransEntity.transferStock_Id, element.stockTransTypeId)
        if (element.financialYear_Id > 0 && element.stockTransEntity.transferStock_Id > 0 && element.stockTransTypeId > 0) {
          this.invTransactionService.getDocumentNumber(element.financialYear_Id, element.stockTransEntity.transferStock_Id, element.stockTransTypeId).subscribe(res => {
            this.data[elementIndex].docReceivedNumber = res.data.docId;
          });
        }
      }
    }, (err) => {
      this.toaster.openWarningSnackBar(err.message);
      element.docReceivedDate = '';
    })

    this.table.renderRows();
  }

  changeUnit(element: IInvTransactionDetails, elementIndex: number, itemIndex: number) {
    // this.data[elementIndex].stockTransDetails[itemIndex].receivedQuantity = 0;
    this.data[elementIndex].stockTransDetails[itemIndex].remainingQuantity = element.baseQuantity / element.convertedUnits.factor;
    this.data[elementIndex].stockTransDetails[itemIndex].quantity = element.baseQuantity / element.convertedUnits.factor;
    this.table.renderRows();
  }

  editObject(element: IInvTransactionDetails, elementIndex: number, itemIndex: number) {

    let quantity = element.receivedQuantity * element.convertedUnits.factor;

    this.data[elementIndex].stockTransDetails[itemIndex].quantity = element.baseQuantity / element.convertedUnits.factor;
    if (quantity > element.baseQuantity) {
      this.toaster.openWarningSnackBar('لايمكن اضافة كمية اكبر من الكمية الموجودة');
      console.log(quantity, element.baseQuantity)
      this.data[elementIndex].stockTransDetails[itemIndex].receivedQuantity = 0;
      this.data[elementIndex].stockTransDetails[itemIndex].remainingQuantity = element.baseQuantity / element.convertedUnits.factor;
    } else
      this.data[elementIndex].stockTransDetails[itemIndex].remainingQuantity = (element.baseQuantity / element.convertedUnits.factor) - element.receivedQuantity;

    if (element.receivedQuantity == null)
      this.data[elementIndex].stockTransDetails[itemIndex].receivedQuantity = 0;
    this.table.renderRows();
    // console.log(element)
  }

  createTransactionObject(item: IInvTransaction): IAddTransaction {
    // console.log(item)
    let transaction: IAddTransaction = {} as IAddTransaction;
    transaction.id = 0;
    transaction.companyId = this.userData.companyId;
    transaction.stock_Id = item.stockTransEntity.transferStock_Id;
    transaction.stockTransType_Id = item.stockTransTypeId;
    transaction.documentDate = this.datePipe.transform(new Date().setDate(new Date(item.docReceivedDate).getDate()), 'yyyy-MM-ddThh:mm:ss') ?? '';
    transaction.documentNumber = item.docReceivedNumber;
    transaction.financialYear_Id = item.financialYear_Id;
    transaction.ReceivedFromTrans_Id = item.id;
    transaction.notes = '';

    transaction.transEntity = {} as ITransEntity;
    transaction.transEntity.stockTransaction_Id = 0;
    transaction.transEntity.transferStock_Id = item.stockId;
    transaction.transEntity.entityType_Id = item.stockTransEntity.entityType_Id;

    transaction.itemData = [];
    item.stockTransDetails.map((obj, index) => {
      transaction.itemData.push({
        preConvertedQuantity: (obj.receivedQuantity * obj.convertedUnits.factor) / obj.convertedUnits.factor,
        quantity: obj.receivedQuantity * obj.convertedUnits.factor,
        price: obj.price,
        unitConversion_Id: obj.convertedUnits.unitConversionId,
        itemId: obj.itemId,
        indexRef: index + 1,
        stockTransaction_Id: 0,
        notes: obj.receivedNotes ?? '',
        serialItems:[]
      });
    });

    console.log(transaction)

    return transaction;
  }

  saveTransaction(item: IInvTransaction) {
    this.loading = true;
    let obj = this.createTransactionObject(item);

    if (obj.documentDate == "" || obj.documentDate == null || obj.documentDate == undefined) {
      this.toaster.openWarningSnackBar('برجاء اختيار التاريخ')
      return;
    }

    if (isNaN(obj.documentNumber) || obj.documentNumber == 0 || obj.documentNumber == null || obj.documentNumber == undefined) {
      this.toaster.openWarningSnackBar('ادخل رقم الاذن')
      return;
    }

    let isQuantity = false;
    obj.itemData.map((x) => {
      if (isNaN(x.preConvertedQuantity) || isNaN(x.quantity)) isQuantity = true;
    })

    if (isQuantity) {
      this.toaster.openWarningSnackBar('أدخل الكميات المستلمة')
      return;
    }

    let maxQuantity = false;
    item.stockTransDetails.map((x) => {
      let quantity = x.receivedQuantity * x.convertedUnits.factor;
      if (quantity > x.baseQuantity) maxQuantity = true;
    })

    if (maxQuantity) {
      this.toaster.openWarningSnackBar('لايمكن اضافة كمية اكبر من الكمية الموجودة');
      return;
    }

    this.invTransactionService.addTransaction(obj).subscribe(
      (data: HttpReponseModel) => {
        this.loading = false;
        if (data.isSuccess) {
          this.invTransactionService.bSubject.next(false);
          this.toaster.openSuccessSnackBar(data.message);
        }
        else if (data.isExists) {
          this.toaster.openWarningSnackBar(data.message);
        }
      },
      (error: any) => {
        this.loading = false;
        console.log(error,'sssssssssssssssssss')
        if(error.data)
        this.toaster.openWarningSnackBar(error.message);
        else
        this.toaster.openWarningSnackBar(error);

      }
    );
  }

  restrictZero(event: any) {
    if ((event.target.value.length === 1 && event.key === '0') && event.target.value.startsWith('0') || event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());

}

