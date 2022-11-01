import { Component, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { FcmConfig } from "../../../models/fcmconfig/FcmConfig";
import { FcmConfUpdate } from "../../../models/fcmconfig/FcmConfUpdate";
import { FcmConfigService } from "../../../services/notiFcmConfig.service";

@Component({
    selector:'fcmconfigDialog',
    templateUrl:'./fcmConfigDialog.component.html'
})
export class fcmconfigDialog implements OnDestroy {
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
        @Inject(MAT_DIALOG_DATA) public data: { fcmConfigModel: FcmConfig },
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : FcmConfigService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
            if (data.fcmConfigModel) {
                this.isEdit = true;
                this.fcmConfigForm.patchValue({
                    id : data.fcmConfigModel.id,
                    isAndroid : data.fcmConfigModel.isAndroid ? "true" : "false",
                    apiKey: data.fcmConfigModel.apiKey,
                    authDomain : data.fcmConfigModel.authDomain,
                    projectId : data.fcmConfigModel.projectId,
                    storageBucket : data.fcmConfigModel.storageBucket,
                    messagingSenderId : data.fcmConfigModel.messagingSenderId,
                    appId : data.fcmConfigModel.appId,
                    measurementId : data.fcmConfigModel.measurementId,
                    serverKey : data.fcmConfigModel.serverKey,
                    senderId : data.fcmConfigModel.senderId,
                    publicKey : data.fcmConfigModel.publicKey,
                });
              }
        }
        ngOnDestroy() {
            this.unsubscribe.forEach((sb) => sb.unsubscribe());
        }
        addOrUpdateCar(){
            
            this.loading = false;
            if(this.fcmConfigForm.valid)
            {
                this.loading = true;
                this.convertforms(this.fcmConfigForm.value)
                this.services.UpdateFcmConfig(this.modelData).subscribe((data : HttpReponseModel) =>{
                    if(data.isSuccess){
                        this.dialogRef.close();
                        this.toaster.openSuccessSnackBar(data.message);
                    }
                    else if (data.isExists) {
                        this.toaster.openWarningSnackBar(data.message);
                      }
                }),
                (error: any) => {
                  this.loading = false;
                  this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
                }
            }
        }
        convertforms(model : any){
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