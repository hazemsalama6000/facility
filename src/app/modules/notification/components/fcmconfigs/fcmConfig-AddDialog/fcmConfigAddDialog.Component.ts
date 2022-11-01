import { Component, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { FcmConfig } from "../../../models/fcmconfig/FcmConfig";
import { FcmConfUpdate } from "../../../models/fcmconfig/FcmConfUpdate";
import { FcmConfigService } from "../../../services/notiFcmConfig.service";
import { fcmconfigDialog } from "../fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'fcmConfigAddDialog',
    templateUrl:'./fcmConfigAddDialog.Component.html'
})
export class fcmConfigAddDialogComponent implements OnDestroy{
    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;

    modelData : FcmConfUpdate = new FcmConfUpdate()

    private unsubscribe: Subscription[] = [];

    isAndroidDropDown = ['Web' , 'Mobile']

    fcmConfigForm: FormGroup = this.fb.group({
        id: [0],
        isAndroid : ["" , Validators.compose([Validators.required ])],
        apiKey : ['' , Validators.compose([Validators.required ])],
        authDomain : ['' , Validators.compose([Validators.required ])],
        projectId : ['' , Validators.compose([Validators.required ])],
        storageBucket : ['' , Validators.compose([Validators.required ])],
        messagingSenderId : ['' , Validators.compose([Validators.required ])],
        appId : ['' , Validators.compose([Validators.required ])],
        measurementId : ['' , Validators.compose([Validators.required ])],
        serverKey : ['' , Validators.compose([Validators.required ])],
        senderId : ['' , Validators.compose([Validators.required ])],
        publicKey : ['' , Validators.compose([Validators.required ])]
      });

      constructor(private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : FcmConfigService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
        }

        ngOnDestroy() {
            this.unsubscribe.forEach((sb) => sb.unsubscribe());
        }
        addOrUpdateCar(){
            if(this.fcmConfigForm.valid){
                this.convertforms(this.fcmConfigForm.value);
                this.services.AddFcmConfig(this.modelData).subscribe((res : HttpReponseModel) => {
                    if (res.isSuccess) {
                        this.toaster.openSuccessSnackBar(res.message);
                    }else{
                        this.toaster.openWarningSnackBar(res.message);
                    }
                })
            }
            
        }
        convertforms(model : any){
            console.log("Hello2")
            this.modelData.Id = model.id
            this.modelData.IsAndroid = model.isAndroid == "true" ? true : false
            this.modelData.PublicKey = model.publicKey
            this.modelData.SenderId = model.senderId
            this.modelData.ServerKey = model.serverKey
            this.modelData.apiKey = model.apiKey
            this.modelData.appId = model.appId
            this.modelData.authDomain = model.authDomain
            this.modelData.measurementId = model.measurementId
            this.modelData.messagingSenderId = model.messagingSenderId
            this.modelData.projectId = model.projectId
            this.modelData.storageBucket = model.storageBucket
        }
}