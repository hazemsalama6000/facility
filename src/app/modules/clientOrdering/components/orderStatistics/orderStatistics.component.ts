import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { IOrderStatusList } from '../../models/IOrderStatusList.interface';
import { OrderingService } from '../../services/ordering.service';

@Component({
  selector: 'app-orderStatistics',
  templateUrl: './orderStatistics.component.html',
  styleUrls: ['./orderStatistics.component.scss']
})
export class OrderStatisticsComponent implements OnInit {

  data: IOrderStatusList[] = [];
  searchModel: any = { OrderEmployeeId: 0, StartDate: null, EndDate: null, };
  startDate: string;
  endDate: string;
  userData: IUserData;
  unsubscribe: Subscription[] = [];

  constructor(
    public orderingService: OrderingService,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {
    let subuserdate = auth.userData.subscribe(res => {
      this.searchModel.OrderEmployeeId = res.employeeId;
      let subchange = orderingService.bSubject.subscribe(res => {
        let date = new Date();
        this.startDate = new Date(date.setMonth(date.getMonth() - 1)).toISOString();
        this.endDate = new Date().toISOString();
        this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
        this.searchModel.EndDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00" ?? '';
        this.getData()
      });
      this.unsubscribe.push(subchange);
    });
    this.unsubscribe.push(subuserdate);
  }

  ngOnInit() { }

  getData() {
    this.orderingService.getStatisticsOrders(this.searchModel).subscribe(res => {
      this.data = res;
    })
  }

  getOrdersByDate() {
    if (this.startDate && this.endDate) {
      this.searchModel.OrderCode = null;
      this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.searchModel.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
    } else {
      this.searchModel.StartDate = '';
      this.searchModel.EndDate = '';
    }
    this.getData();
  }

}
