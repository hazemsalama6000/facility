import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/core-module/FcmMessagingServices/messaging.service';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { INotifications } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/models/INotifications.interface';
import { NotificationsService } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/services/notifications.service';
import * as moment from "moment";

@Component({
  selector: 'app-viewnotifications',
  templateUrl: './viewnotifications.component.html',
  styleUrls: ['./viewnotifications.component.scss']
})
export class ViewnotificationsComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<INotifications>;
  displayedColumns: string[] = ['n', 'img', 'senderName', 'date', 'title', 'message', 'transType', 'state', 'action'];
  dataSource: any;
  dropdownNotifyType: LookUpModel[] = [];
  dropdownNotifyStatus: any[] = [
    { Id: null, Name: 'الكل' },
    { Id: 'true', Name: 'مقروء' },
    { Id: 'false', Name: 'غير مقروء' }
  ];
  searchModel: ISearchRiffles = { User_Id: '', PageNumber: 1, PageSize: 100 };
  userData: IUserData;
  showbtn: boolean = false;
  totalRecord = 0;
  startDate: string;
  endDate: string;
  url: string = localStorage.getItem('companyLink') as string;
  private unsubscribe: Subscription[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private FcmService: MessagingService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private toaster: toasterService,
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.User_Id = data.userId;

      this.getNotificationData()
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void {
    this.FcmService.receiveMessage().subscribe((res:any) => {
      if (res.data != undefined) {
        this.dataSource.data.splice(0, 0, (res.data as {}) as INotifications);
        this.totalRecord += 1;
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
    });

  }

  fillDropdown() {
    this.notificationsService.getLookUpMessageType().subscribe(res => this.dropdownNotifyType = res)
  }

  getNotificationData() {
    this.notificationsService.getAllNotification(this.searchModel).subscribe(res => {
      this.totalRecord = res.totalCount;
      this.dataSource = new MatTableDataSource<INotifications>(res.messagesRecords);
      this.dataSource.paginator = this.paginator;
    });
  }

  getNotifyByDate() {
    if (this.startDate && this.endDate) {
      this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.searchModel.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.getNotificationData();
    } else {
      this.searchModel.StartDate = '';
      this.searchModel.EndDate = '';
      this.getNotificationData();
    }
  }

  //  getNotifyByStatus(item:any){
  //   if (item) {
      
  //   } else {
  //     delete this.searchModel.ReadOnly
  //   }
  //   this.getNotificationData();
  //  }

  pageEvent(event: any) {
    this.getNotificationData();
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

export interface ISearchRiffles {
  User_Id: string;
  MessageType_Id?: number;
  ReadOnly?: boolean;
  StartDate?: string;
  EndDate?: string;
  PageSize: number;
  PageNumber: number;
}

