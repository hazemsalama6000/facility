import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ClientBranchService } from 'src/app/modules/client/services/branch.service';
import { IOrdersList, IOrderStatus } from 'src/app/modules/clientOrdering/models/IOrdersList.interface';
import { OrderingService } from 'src/app/modules/clientOrdering/services/ordering.service';
import { OrderStatusService } from 'src/app/modules/clientOrdering/Services/OrderStatus.Service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';

@Component({
  selector: 'app-superVisorOrders',
  templateUrl: './superVisorOrders.component.html',
  styleUrls: ['./superVisorOrders.component.scss']
})
export class SuperVisorOrdersComponent implements OnInit {

  
  displayedColumns = ['n', 'orderCode', 'orderDate', 'clientBranch', 'orderEmployee', 'status', 'notes'];
  data: IOrdersList[] = [];
  totalRecord = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchModel: IOrderSearch = { OrderEmployeeId: 0, PageNumber: 1, PageSize: 10, };
  startDate: string;
  endDate: string;
  dropdownClientBranch: LookUpModel[] = [];
  dropdownOrderStatus: LookUpModel[] = [];

  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private orderService: OrderingService,
    private orderStatusService: OrderStatusService,
    private clientBranchService: ClientBranchService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.OrderEmployeeId = data.employeeId;
      this.fillDropdown();
      let subData = orderService.bSubject.subscribe(res => this.getOrdersData());
      this.unsubscribe.push(subData);
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  fillDropdown() {
    this.orderStatusService.ListOfOrderStatus().subscribe(res => this.dropdownOrderStatus = res);
    this.clientBranchService.listOfClientBranchByEmployeeId(this.userData.employeeId).subscribe(res => this.dropdownClientBranch = res);
  }

  getOrdersData() {
    this.orderService.getOrders(this.searchModel).subscribe(res => {
      this.data = res.data;
      this.isLoadingResults = false;
      this.totalRecord = res.totalRecords;

      this.orderService.orderCount.next(res.totalRecords);
    })
  }

  getOrdersByDate() {
    if (this.startDate && this.endDate) {
      this.searchModel.OrderCode = null;
      this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.searchModel.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.getOrdersData();
    } else {
      this.searchModel.StartDate = '';
      this.searchModel.EndDate = '';
      this.getOrdersData();
    }
  }

  getTransactionByCode = (text: string) => {

    (text) ? this.searchModel.OrderCode = text : delete this.searchModel.OrderCode;
    this.getOrdersData();
  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getOrdersData();
  }

  clearSearch() {
    this.startDate = '';
    this.endDate = '';
    this.searchModel = { OrderEmployeeId: this.userData.employeeId, PageNumber: 1, PageSize: 5, ClientBranchId: null, EndDate: null, StartDate: null, OrderCode: null, OrderStatusId: null };
    this.getOrdersData();
  }

  getActiveStatus = (status: IOrderStatus[]): IOrderStatus => status.find(x => x.currentStatus == true) as IOrderStatus

  openViewStatusDialog(order: IOrdersList) {
    // this.dialog.open(ViewOrderStatusComponent, {
    //   minWidth: '50%',
    //   height: '100vh',
    //   position: { right: '0' },
    //   data:{order:order}
    // })
  }

  ngOnDestroy = () => this.unsubscribe.forEach((sb) => sb.unsubscribe());

}

export interface IOrderSearch {
  ClientBranchId?: number | null,
  OrderStatusId?: number | null,
  OrderCode?: string | null,
  EndDate?: string | null,
  StartDate?: string | null,

  OrderEmployeeId: number,
  PageNumber: number,
  PageSize: number,
}

