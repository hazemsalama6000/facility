import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { IUsers } from "src/app/modules/permissions/models/IRolesProfile.interface";
import { UsersService } from "src/app/modules/permissions/services/users.service";
import { NotiModule } from "../../../models/NotiModule/NotiModule";
import { notiModule } from "../../../services/notiModule.service";
import { fcmconfigDialog } from "../../fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'NotiModuleForm',
    templateUrl:'./NotiModuleForm.Component.html'
})
export class NotiModuleForm implements OnInit , OnDestroy{
    private unsubscribe: Subscription[] = [];
    userData :  IUserData;
    loading: boolean = false;
    saveButtonClickedFlag : true
    CompanyUsers : IUsers[] = []
    constructor(private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : notiModule,
        private userServices : UsersService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
        }
        ngOnDestroy(): void {
            this.unsubscribe.forEach(ele => ele.unsubscribe())
        }
        ngOnInit(): void {
            this.userServices.GetCompanyUsers(this.userData.companyId).subscribe(data => {
                this.CompanyUsers = data
            })
        }
        NotiModuleForm: FormGroup = this.fb.group({
            name : ["" , Validators.compose([Validators.required ])],
            usersIds : [null]
          });
        addOrUpdateModel(){
            console.log(this.CompanyUsers)
            // if(this.NotiModuleForm.valid){
            //     this.services.AddnotiModule(this.NotiModuleForm.value)
            //     .subscribe(res => {
            //         console.log(res)
            //         this.toaster.openSuccessSnackBar(res.message); 
            //     }, (err) => {
            //         console.log(err)
            //         this.toaster.openWarningSnackBar(err.message);
            //     })                
            // }
          }
}