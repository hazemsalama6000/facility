import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
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

  columnsToDisplay = ['id', 'docNumber', 'docDate', 'transType', 'stockName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IInvTransaction | null;
  @ViewChild(MatTable) table: MatTable<IInvTransaction>;

  data: any[] = [];
  totalRecord = 0;
  searchModel: any = { CompanyBranchId: 0, PageNumber: 1, PageSize: 5, IsTransferRequest: true };
  isLoadingResults = true;
  isRateLimitReached = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];
  convertedUnits = [
    { "unitConversionId": 18, "convertedUnitName": "Piece", "factor": 1, "quantityInExcutedUnit": 6345, "isBaseUnit": true },
    { "unitConversionId": 24, "convertedUnitName": "Can", "factor": 12, "quantityInExcutedUnit": 528.75, "isBaseUnit": false },
    { "unitConversionId": 25, "convertedUnitName": "Carton", "factor": 100, "quantityInExcutedUnit": 63.45, "isBaseUnit": false }]

  constructor(
    private invTransactionService: InvTransactionService,
    private auth: AuthService,
    private financialyearService: FinancialyearService,
    private toaster: toasterService,
    private datePipe: DatePipe,
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.CompanyBranchId = data.branchId;
      this.getTransactionData();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  getTransactionData() {
    this.invTransactionService.getTransaction(this.searchModel).subscribe(res => {
      this.data = res.data;
      this.isLoadingResults = false;
    })
  }

  pageEvent(event: any) {
    console.log(event);
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getTransactionData();
  }

  onChangeDate(element: IInvTransaction, elementIndex: number) {

    element.docReceivedNumber = 0;
    this.financialyearService.checkFinancialYear(this.userData.companyId, this.datePipe.transform(new Date(element.docReceivedDate), 'yyyy-MM-dd') + "T00:00:00" ?? '').subscribe(res => {
      if (res.data) {
        element.financialYear_Id = res.data.id;
        this.data[elementIndex].financialYear_Id = res.data.id;
        // console.log(element,element.financialYear_Id > 0 && element.stockId > 0 && element.transTypeId > 0)
        if (element.financialYear_Id > 0 && element.stockId > 0 && element.transTypeId > 0) {
          this.invTransactionService.getDocumentNumber(element.financialYear_Id, element.stockId, element.transTypeId).subscribe(res => {
            this.data[elementIndex].docReceivedNumber = res.data.docId;
          });
        }
      }
    }, (err) => {
      this.toaster.openWarningSnackBar(err);
      element.docReceivedDate = '';
    })

    this.table.renderRows();
  }

  changeUnit(elementIndex: number, itemIndex: number) {
    this.data[elementIndex].stockTransDetails[itemIndex].receivedQuantity = 0;
    this.table.renderRows();
  }

  editObject(element: IInvTransactionDetails, elementIndex: number, itemIndex: number) {

    this.data[elementIndex].stockTransDetails[itemIndex].remainingQuantity = 11;
    this.table.renderRows();
    console.log(element)
  }

  createTransactionObject(item: IInvTransaction): IAddTransaction {
    console.log(item)
    let transaction: IAddTransaction = {} as IAddTransaction;
    transaction.id = 0;
    transaction.companyId = this.userData.companyId;
    // transaction.stock_Id = this.masterForm.get('stock_Id')?.value;
    // transaction.stockTransType_Id = this.masterForm.get('stockTransType_Id')?.value;
    transaction.documentDate = this.datePipe.transform(new Date(item.docReceivedDate), 'yyyy-MM-dd') + "T00:00:00" ?? '';
    transaction.documentNumber = item.docReceivedNumber;
    // transaction.entityType_Id = this.masterForm.get('entityType_Id')?.value;
    transaction.financialYear_Id = item.financialYear_Id;
    transaction.notes = item.receivedNotes;

    transaction.getStockTransEntity = {} as ITransEntity;
    transaction.stockTransType_Id = 0;
    transaction.getStockTransEntity.stockTransaction_Id = 0;

    transaction.itemData = [];
    item.stockTransDetails.map((obj, index) => {
      transaction.itemData.push({
        preConvertedQuantity: obj.baseQuantity,
        quantity: 0,//obj.quantity,
        price: obj.price,
        unitConversion_Id: obj.convertedUnit.unitConversionId??0,
        itemId: 0,//obj.id,
        indexRef: index + 1,
        stockTransaction_Id: 0
      });
    });

    console.log(item, transaction)

    return transaction;
  }

  saveTransaction(item: IInvTransaction) {
    this.createTransactionObject(item);
  }

  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());

}

