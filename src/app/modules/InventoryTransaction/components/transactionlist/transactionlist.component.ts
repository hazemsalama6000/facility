import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IInvTransaction } from '../../models/IInvTransaction.interface';
import { ISeachTransaction } from '../../models/ISeachTransaction.interface';
import { InvTransactionService } from '../../services/invTransaction.service';

@Component({
  selector: 'app-transactionlist',
  templateUrl: './transactionlist.component.html',
  styleUrls: ['./transactionlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TransactionlistComponent implements OnInit {

  columnsToDisplay = ['id', 'docNumber', 'docDate', 'transType', 'stockName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IInvTransaction | null;

  data: any[] = [];
  totalRecord = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchModel: ISeachTransaction = { CompanyBranchId: 0, PageNumber: 1, PageSize: 5 };
  dropdownCustomerData: LookUpModel[] = [{ Id: 1, Name: 'name1' }];
  startDate: string;
  endDate: string;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private invTransactionService: InvTransactionService,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {


    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.CompanyBranchId = data.branchId;
      this.getTransactionData();
    });
    this.unsubscribe.push(subuser);

    this.fillDropdown();
  }

  ngOnInit(): void { }

  getTransactionData() {
    this.invTransactionService.getTransaction(this.searchModel).subscribe(res => {
      this.data = res.data;
      this.isLoadingResults = false;
      this.totalRecord = res.totalRecords;
    })
  }

  pageEvent(event: any) {
    console.log(event);
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getTransactionData();
  }

  fillDropdown(){

  }

  getTransactionByCode = (text: string) => {
    this.startDate = '';
    this.endDate = '';
    let val: number = parseInt(text);
    (!isNaN(val)) ? this.searchModel.DocNumber = val : delete this.searchModel.DocNumber;
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



  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());
}
