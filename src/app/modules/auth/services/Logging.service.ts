import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})

export class LoggingService {

    LogRequestsMessage(msg: string) {
        // TODO: Log Any Request
        console.log(msg);
    }
    LogRequestError(msg: { severity: string, summary: string, detail: string }) {
        // TODO: Log Any Response Error
        console.log(msg);
    }

} 