import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
	providedIn:'root'
})

export class ErrorResponse
{
   Subject = new BehaviorSubject<any>('');

   SubscribeToError():Observable<any>
   {
    return  this.Subject.asObservable();
   }
}