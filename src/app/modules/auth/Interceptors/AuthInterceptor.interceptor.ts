import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { catchError, finalize, Observable, retry, throwError } from "rxjs";
import { loaderService } from "src/app/core-module/UIServices/loader.service";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private loadService: loaderService, private translateService: TranslateService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadService.isLoading.next(true);

        return next.handle(this.AddAuthToHeader(req))

            .pipe(
                catchError(
                    (error: any) => {
                        return throwError(() => error);
                    }
                ), finalize(() => { this.loadService.isLoading.next(false); })
            );
//last version from code
        // .pipe(
        //     catchError(
        //         (error: any) => {
        //             console.log(req)
        //             return throwError(() => new Error(error)) as Observable<HttpEvent<any>>;
        //         }
        //     ), finalize(() => { this.loadService.isLoading.next(false); })
        // );

    }

    AddAuthToHeader(request: HttpRequest<any>) {
        let lang = this.translateService.currentLang;

        return request.clone({
            setHeaders: {
                //	'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Accept-Language": lang == 'ar' ? "ar-EG" : "en-US",

                //		"Platform": "api",
                //		"sequence":"123",
                //		"Cache-Control":"no-cache",
                //		"api-version":"1.0",
                //		"ApiKey": "uqtfggwvbolwhphwjkhtewfqawyslnka",
                //		"Source":"121",
                //		"Source-Version": "1.0.23",


                /* 'Access-Control-Allow-Origin': '*',
                 'Access-Control-Allow-Credentials': 'true',
                 'Access-Control-Allow-Headers': 'Content-Type',
                   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                 'lang':'ar' */
            }
        });
    }


}