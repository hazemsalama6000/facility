import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IEntityTypeUpdate } from '../models/IEntityTypeUpdate.interface';

@Injectable({
  providedIn: 'root'
})
export class EntitytypeService {

  constructor(private http: CommonHttpService) { }

  getTransTypeWithEntityType(stockTransTypeId: number): Observable<IEntityTypeUpdate[]> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_ENTITY_TYPE_BY_TRANS_TYPE_ID}?stockTransTypeId=${stockTransTypeId}`).pipe(
      map(items => items.data as IEntityTypeUpdate[])
    )
  }

  manageTransTypeWithEntityType(entityType: IEntityTypeUpdate[]): Observable<HttpReponseModel>{
    return this.http.CommonPostRequests(entityType,`${localStorage.getItem('companyLink')}${HttpPaths.API_UPDATE_ENTITY_TYPE_BY_TRANS_TYPE_ID}`)
  }

}
