import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
   
  TOKENIN_LOCALSTORAGE="token";

  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

	// TODO check token existance and return true
   //const currentUser = this.authService.currentUserValue;
    if (localStorage.getItem(this.TOKENIN_LOCALSTORAGE)) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
