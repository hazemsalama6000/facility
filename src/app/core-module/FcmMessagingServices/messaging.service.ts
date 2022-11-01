import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, map } from 'rxjs'
import { INotifications } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/models/INotifications.interface';

@Injectable({ providedIn: 'root' })
export class MessagingService {

    currentMessage = new BehaviorSubject({});

    constructor(private angularFireMessaging: AngularFireMessaging) { }

    FcmTokenSub = new BehaviorSubject("")

    requestPermission() {
        return this.angularFireMessaging.requestToken
    }

    receiveMessage() {
        return this.angularFireMessaging.messages;
    }

}