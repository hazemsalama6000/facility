import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { finalize, tap } from 'rxjs';
import { LoggingService } from '../services/Logging.service';
  
  @Injectable()

  export class LoggingInterceptor implements HttpInterceptor {
    constructor(private LoggingService: LoggingService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      const started = Date.now();
      let ok: string;
  
      return next.handle(req).pipe(
        tap({
          next: (event) =>
            (ok = event instanceof HttpResponse ? 'succeeded' : ''),
          error: (error) => (ok = 'failed'),
        })
		,
  
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
               ${ok} in ${elapsed} ms.`;
          this.LoggingService.LogRequestsMessage(msg);
        })
      );
    }
  }
  1