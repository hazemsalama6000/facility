import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { HttpPaths } from '../../auth/Enums/HttpPaths.enum';
import { IAddRiffles } from '../models/IAddRiffles.interface';

@Injectable({
  providedIn: 'root'
})
export class RifflesService {
  bSubject = new BehaviorSubject<boolean>(false);

constructor(private http:CommonHttpService) { }



getCommmittee() {
  return this.http.CommonGetRequests(`${localStorage.getItem('companyLink')}${HttpPaths.API_LIST_OF_COMMMITTEE}`).pipe(
    map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel))
  );
}


addRiffle(model: IAddRiffles): Observable<HttpReponseModel> {
  return this.http.CommonPostRequests(model, `${localStorage.getItem('companyLink')}${HttpPaths.API_ADD_COUNTING_PROCESS}`)
}

}
