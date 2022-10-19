import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from 'src/app/modules/auth/Enums/HttpPaths.enum';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

constructor(private http:CommonHttpService) { }

changePassword(model:any){
  return this.http.CommonPutRequests(model,`${localStorage.getItem('companyLink')}${HttpPaths.API_CHANGE_PASSWORD}`)
}

}
