import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/core-module/FcmMessagingServices/messaging.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LayoutService } from '../../../../../layout';
import { INotifications } from '../models/INotifications.interface';
import { NotificationsService } from '../services/notifications.service';
import * as moment from "moment";
export type NotificationsTabsType =
  | 'kt_topbar_notifications_1'
  | 'kt_topbar_notifications_2'
  | 'kt_topbar_notifications_3';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() countNotifiy = new EventEmitter<number>();

  activeTabId: NotificationsTabsType = 'kt_topbar_notifications_1';
  notifications: INotifications[] = [];
  message: any;
  userdata: IUserData;
  url: string = localStorage.getItem('companyLink') as string;
  unsubscribe: Subscription[] = [];

  constructor(
    private FcmService: MessagingService,
    private notificationsService: NotificationsService,
    private auth: AuthService
  ) {
    let userDataSub = auth.userData.subscribe(res => {
      this.userdata = res;
      this.getAllNotification();
    });
    this.unsubscribe.push(userDataSub)
  }

  ngOnInit(): void {
    this.FcmService.receiveMessage().subscribe(res => {
      if (res.data != undefined)
        this.notifications.splice(0, 0, (res.data as {}) as INotifications)
    });
  }

  getAllNotification() {

    this.notificationsService.getAllNotification({User_Id:this.userdata.userId,PageNumber:1,PageSize:1000,ReadOnly:true}).subscribe(res => {
      this.notifications = res.messagesRecords;
      this.countNotifiy.emit(res.messagesRecords.filter(x => x.readOnly == true).length)
    })

  }

  filterNotifications(type: string): INotifications[] {
    return this.notifications.filter(x => x.messageTypeSysName == type);
  }

  customDate(date: string | Date) {
    moment.locale('ar');
    return moment(new Date(date), 'YYYYMMDD').fromNow();
  }

  setActiveTabId(tabId: NotificationsTabsType) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

