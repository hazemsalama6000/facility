import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FcmConfig } from "../../../models/fcmconfig/FcmConfig";

@Component({
    selector:'fcmconfigDebugDetails',
    templateUrl:'./fcmconfig-DebugDetails.component.html'
})
export class fcmconfigDebugDetails {

    modelData : FcmConfig

    constructor( @Inject(MAT_DIALOG_DATA) public data: { fcmConfigModel: FcmConfig }){
        this.modelData = data.fcmConfigModel
    }
}