import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FcmConfigComponent } from "./components/fcmconfigs/fcmconfig.component";
import { NotiModuleComponent } from "./components/NotiModules/NotiModule.Component";
import { ViewnotificationsComponent } from "./components/viewnotifications/viewnotifications.component";

const routes: Routes = [
	 { path: 'fcmconfig', component: FcmConfigComponent },
	 { path: 'notimodule', component: NotiModuleComponent },
	 { path: 'viewallnotification', component: ViewnotificationsComponent },
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class NotificationRoutingModule { }