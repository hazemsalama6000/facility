import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { IRiffles } from 'src/app/modules/inventoryriffels/models/IRiffles.interface';
import { RifflesService } from 'src/app/modules/inventoryriffels/services/riffles.service';
import { IInvTransaction } from 'src/app/modules/InventoryTransaction/models/IInvTransaction.interface';
import { InvTransactionService } from 'src/app/modules/InventoryTransaction/services/invTransaction.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OrdersComponent implements OnInit {

  columnsToDisplay = ['n', 'docNumber', 'docDate', 'stockName', 'transType', 'entityName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IInvTransaction | null;

  data: any[] = [];
  totalRecord = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchModel: any = { CompanyBranchId: 0, stockEmployeeId: 0, PageNumber: 1, PageSize: 10, };

  dropdownEntity: LookUpModel[] = [];
  dropdownStock: LookUpModel[] = [];


  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private invTransactionService: InvTransactionService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.CompanyBranchId = data.branchId;
      this.searchModel.stockEmployeeId = data.employeeId;
      this.getTransactionData();
    });
    this.unsubscribe.push(subuser);

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
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getTransactionData();
  }

  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());

}
