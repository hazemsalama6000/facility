import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, EMPTY, ReplaySubject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ILoginData } from '../models/ILoginData.interface';
import { ICompanyConfigResponse } from '../models/ICompanyConfigResponse.interface';
import { ILoginResponseInterface } from '../models/ILoginResponse.interface';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { HttpPaths } from '../Enums/HttpPaths.enum';
import { IUserData } from '../models/IUserData.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  API_USERS_URL = `${HttpPaths.API_LOGIN_URL}`;
  API_COMPANYCONFIG_URL = `${environment.apiUrl}${HttpPaths.API_COMPANYCONFIG_URL}`;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  userData = new ReplaySubject<IUserData>();


  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private CommonHttp: CommonHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);

    this.isLoading$ = this.isLoadingSubject.asObservable();
    /*    const subscr = this.getUserByToken().subscribe();
    */  //  this.unsubscribe.push(subscr);
  }

  // public methods
  CheckCompanyExistance(LoginData: ILoginData): Observable<ICompanyConfigResponse> {

    this.isLoadingSubject.next(true);

    return this.authHttpService.CheckCompanyExistance(LoginData).pipe(

      map((data: any) => {

        let CompanyConfig: ICompanyConfigResponse;
        CompanyConfig = data.data;
        console.log(CompanyConfig);
        return CompanyConfig;

      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  Login(LoginData: ILoginData, url: string) {

    return this.CommonHttp.CommonPostRequests(LoginData, `${url}${this.API_USERS_URL}`).pipe(

      map((LoginResponse: ILoginResponseInterface) => {
        console.log(LoginResponse)
        return LoginResponse;
      }), catchError((err) => {
        let LoginResponse: ILoginResponseInterface = { success: "false", token: '' };
        return of(LoginResponse);
      })

    );
  }



  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  logoutByUserId(userId: number) {
    return this.CommonHttp.CommonPostRequests(null, `${localStorage.getItem("companyLink")}${HttpPaths.API_LOGINWITH_USERID}${userId}`);
  }

  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();


    if (!auth || !auth.userId) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.token, auth.userId).pipe(
      map((user: any) => {
        if (user) {

        } else {
          this.logout();
        }
        console.log(user);

        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getUserByToken1(): Observable<any> {

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken1(localStorage.getItem("companyLink") as string).pipe(
      map((user: any) => {
        if (user) {
          this.userData.next(user.data);
        } else {
          this.logout();
        }

        return user.data;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  /*  registration(user: UserModel): Observable<any> {
      this.isLoadingSubject.next(true);
      return this.authHttpService.createUser(user).pipe(
        map(() => {
          this.isLoadingSubject.next(false);
        }),
        switchMap(() => this.login(user.email, user.password)),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
    }*/

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: ILoginResponseInterface): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
