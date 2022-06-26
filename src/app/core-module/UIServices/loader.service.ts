import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({providedIn:'root'})

export class loaderService
{

	public isLoading:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);

}