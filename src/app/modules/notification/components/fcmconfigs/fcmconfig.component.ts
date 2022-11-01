import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { FcmConfig } from "../../models/fcmconfig/FcmConfig";
import { FcmConfigService } from "../../services/notiFcmConfig.service";

@Component({
    selector:'Noti-FcmConfig',
    templateUrl:'./fcmconfig.component.html'
})
export class FcmConfigComponent {
	title:string;
	icon:string;
    model:FcmConfig;

	edit(model:FcmConfig){
          this.model=model;
	}

	StateEmit(model:FcmConfig){
	
	}
}