import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';

// #fake-start#
import { AuthInterceptor } from './modules/auth/Interceptors/AuthInterceptor.interceptor';
import { LoggingInterceptor } from './modules/auth/Interceptors/LoggingInterceptor.interceptor';

import { ErrorInterceptor } from './modules/auth/Interceptors/ErrorInterceptor.interceptor';
import { SharedModule } from './shared-module/shared-module.module';

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core-module/custom-route-reuse-strategy';
import {HashLocationStrategy,LocationStrategy} from '@angular/common';
// #fake-end#

function appInitializer(authService: AuthService) {
	return () => {
		return new Promise((resolve) => {
			//@ts-ignore
			authService.getUserByToken().subscribe().add(resolve);
		});
	};
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot(),
		HttpClientModule,
		ClipboardModule,
		SharedModule,
		AppRoutingModule,
		InlineSVGModule.forRoot(),
		NgbModule
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: CustomRouteReuseStrategy
		},
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			multi: true,
			deps: [AuthService],
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},

		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoggingInterceptor,
			multi: true
		},
		/*  {
		  provide:HTTP_INTERCEPTORS,
		  useClass:CachingInterceptor,
		  multi:true
		  },*/
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptor,
			multi: true
		}/*,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: RetryInterceptor,
			multi: true
		}*/,
		{provide:LocationStrategy,useClass:HashLocationStrategy}
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
