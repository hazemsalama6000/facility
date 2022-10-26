import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IAddRiffles } from '../models/IAddRiffles.interface';
import { IRiffle } from '../models/IRiffle.interface';
import { IRiffles } from '../models/IRiffles.interface';

@Injectable({
  providedIn: 'root'
})
export class RifflesService {
  bSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: CommonHttpService) { }



  getCommmittee() {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_COMMMITTEE}`).pipe(
      map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
    );
  }

  getRiffleById(riffleId: number): Observable<IRiffle> {
    return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_RIFFLE_BY_ID}`).pipe(
      map(items => items.data as IRiffle)
    )
  }

  getRifflesData(searchModel: any): Observable<IRiffles[]> {
    // return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_GET_RIFFLE_DATA}`).pipe(
    //   map(items => items.data as IRiffles[])
    // )
    return of([
      {
        id: 1,
        number: "12",
        commmittee_Id: 2,
        commmitteeName: "لجنة فرعية",
        date: Date(),
        isCountingPartial: false,
        stock_Id: 12,
        stockName: "مخزن السلام",
        finalSave: false
      }, {
        id: 1,
        number: "12",
        commmittee_Id: 2,
        commmitteeName: "لجنة فرعية",
        date: Date(),
        isCountingPartial: false,
        stock_Id: 12,
        stockName: "مخزن السلام",
        finalSave: true
      }
    ] as IRiffles[])
  }

  addRiffle(model: IAddRiffles): Observable<HttpReponseModel> {
    return this.http.CommonPostRequests(model, `${localStorage.getItem('companyLink')}${HttpPaths.API_ADD_COUNTING_PROCESS}`)
  }

}
