import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IOrdersList, IOrderStatus } from '../../models/IOrdersList.interface';

@Component({
  selector: 'app-viewOrderStatus',
  templateUrl: './viewOrderStatus.component.html',
  styleUrls: ['./viewOrderStatus.component.scss']
})
export class ViewOrderStatusComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: { order: IOrdersList }
  ) { }

  ngOnInit() {
    console.log(this.data)
  }

  getActiveStatus = (status: IOrderStatus[]): IOrderStatus => status.find(x => x.currentStatus == true) as IOrderStatus;

  getDiffDate(dateStart: Date, index: number): string {
    let dateEnd = this.data.order.status.find(x => x.currentStatus == true)?.statusDate
    if (dateEnd && dateEnd != null) {

      let sdate = new Date(dateStart)
      let edate = new Date(dateEnd)
      let diffDate = edate.valueOf() - sdate.valueOf();
      // console.log(new Date(diffDate), dateEnd, dateStart, new Date(new Date().setDate(new Date().getDate() - 5)))
      // duration.asYears(), duration.asMonths(), duration.asDays(), duration.asHours() - (24 * 4), duration.asMinutes() - (11 * 60)
      //  let duration = moment.duration(moment(dateEnd).diff(dateStart)).humanize();
      console.log(sdate.valueOf(), edate.valueOf(), diffDate/24, diffDate/60)
    }
    return '';
  }


}
