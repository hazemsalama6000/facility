import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from 'src/app/modules/auth/Enums/HttpPaths.enum';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { INotifications, INotificationsPagination } from '../models/INotifications.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: CommonHttpService) { }

  // getAllNotifications(searchModel: any): Observable<INotifications[]> {
  //   let queryString = Object.keys(searchModel).map((key: string) =>
  //     searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
  //   ).filter(x => x != null).join('&');

  //   return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_NOTIFICATION_BY_USER_ID}${queryString}`).pipe(
  //     map(items => items.data as INotifications[])
  //   )
  // }
  getAllNotification(searchModel: any): Observable<INotificationsPagination> {
    let queryString = Object.keys(searchModel).map((key: string) =>
      searchModel[key] != null && searchModel[key] != '' && searchModel[key] != undefined ? key + '=' + searchModel[key] : null
    ).filter(x => x != null).join('&');

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_NOTIFICATION_BY_USER_ID}${queryString}`).pipe(
      map(items => items.data as INotificationsPagination)
    )
  }

  getLookUpMessageType(): Observable<LookUpModel[]> {

    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_MESSAGE_TYPE}`).pipe(
      map((items: any) => items.data.map((item: any) => ({ Id: item.id, Name: item.name })) as LookUpModel[])
    )
  }

}
