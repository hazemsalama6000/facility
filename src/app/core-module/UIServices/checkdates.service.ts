import { Injectable } from "@angular/core";
import { toasterService } from "./toaster.service";



@Injectable({ providedIn: 'root' })

export class CheckDatesService {

	constructor(private toaster: toasterService){}

	checkDateBiggerThanToday(id:string) {

		 var arr1 = (document.getElementById(id) as HTMLInputElement).value.split('/');
         let customizedDate=arr1[1]+'/'+arr1[0]+'/'+arr1[2];

		if( new Date(customizedDate )  > new Date()){
			(document.getElementById(id) as HTMLInputElement).value = "";
			this.toaster.openWarningSnackBar("التاريخ اكبر من تاريخ اليوم");
		}
	}


}