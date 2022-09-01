import { Injectable } from '@angular/core';
import { Observable ,map, of} from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { LookUpModel } from 'src/app/shared-module/models/lookup';

@Injectable({
  providedIn: 'root'
})
export class InternaldivisionService {

  constructor(private http: CommonHttpService) { }

  getLookUpStock(): Observable<LookUpModel[]> {
    // return this.http.CommonGetRequests(``)
    //   .pipe(map(Items => Items.data.map((Item: any) => ({ Id: Item.id, Name: Item.name }) as LookUpModel)));
  return of([
    {Id:1,Name:"مخزن 1"},
    {Id:2,Name:"مخزن 2"},
    {Id:3,Name:"مخزن 3"},
    {Id:4,Name:"مخزن 4"}
  ]as LookUpModel[])
  }

}
