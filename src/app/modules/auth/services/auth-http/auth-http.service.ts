import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import { ILoginData } from '../../models/ILoginData.interface';
import { ICompanyConfigResponse } from '../../models/ICompanyConfigResponse.interface';
import { HttpPaths } from '../../Enums/HttpPaths.enum';
import {  ILoginResponseInterface } from '../../models/ILoginResponse.interface';

const API_USERS_URL = `${HttpPaths.API_LOGIN_URL}`;
const API_COMPANYCONFIG_URL = `${environment.apiUrl}${HttpPaths.API_COMPANYCONFIG_URL}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  CheckCompanyExistance(LoginData : ILoginData): Observable<any> 
  {
   
    return this.http.post<ICompanyConfigResponse>(`${API_COMPANYCONFIG_URL}${LoginData.companyCode}`, {});

  }

  login( LoginData : ILoginData , url:string )
  {
    
	return this.http.post<ILoginResponseInterface>
	(
	 `${url}${API_USERS_URL}`
	 , {userName:LoginData.userName,companyCode:LoginData.companyCode,password:LoginData.password}
	  );

  }



/*  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }
*/
  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string,userId:string): Observable<any> {
    
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('userId',userId);
    return this.http.get<any>(`${API_USERS_URL}/getUser`, {
     
      headers: httpHeaders,
      params:params
    });
  }
  
  getUserByToken1(url: string): Observable<any> {
    
    return this.http.get<any>(`${url}${HttpPaths.API_GET_USER_DATA}`);
  }

}
