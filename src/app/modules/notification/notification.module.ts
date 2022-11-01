import { NgModule } from '@angular/core';
import { FcmConfigComponent } from './components/fcmconfigs/fcmconfig.component';
import { NotificationRoutingModule } from './notification.routing.module';
import { SharedModule } from  '../..//shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { CommonModule, DatePipe } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { fcmconfigupset } from './components/fcmconfigs/fcmconfig-upset/fcmconfig-upset.component';
import { fcmconfiglistcontent } from './components/fcmconfigs/fcmconfig-listcontent/fcmconfig-listcontent.component';
import { fcmconfigDialog } from './components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { fcmconfigDebugDetails } from './components/fcmconfigs/fcmconfig-DialogDetails/fcmconfig-DebugDetails.Component';
import { fcmConfigAddDialogComponent } from './components/fcmconfigs/fcmConfig-AddDialog/fcmConfigAddDialog.Component';
import { NotiModuleComponent } from './components/NotiModules/NotiModule.Component';
import { NotiModuleForm } from './components/NotiModules/NotiModuleForm/NotiModuleForm.Component';
import { NotiModuleUpdateForm } from './components/NotiModules/NotiModuleUpdateForm/NotiModuleUpdateForm.Component';
import { ViewnotificationsComponent } from './components/viewnotifications/viewnotifications.component';


@NgModule({
    declarations:[
        FcmConfigComponent,
        fcmconfigupset,
        fcmconfiglistcontent,
        fcmconfigDialog,
        fcmconfigDebugDetails,
        fcmConfigAddDialogComponent,
        NotiModuleComponent,
        NotiModuleForm,
        NotiModuleUpdateForm,
        ViewnotificationsComponent
    ],
    imports:[
        NotificationRoutingModule,
        SharedModule,
        TranslationModule,
        CommonModule,
        InlineSVGModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule
    ],
    exports:[],
    providers:[DatePipe]
})
export class NotificationModule { }