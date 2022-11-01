import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { IUsers } from "src/app/modules/permissions/models/IRolesProfile.interface";
import { UsersService } from "src/app/modules/permissions/services/users.service";
import { NotiModule, UserInfo } from "../../../models/NotiModule/NotiModule";
import { notiModule } from "../../../services/notiModule.service";
import { fcmconfigDialog } from "../../fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'NotiModuleUpdateForm',
    templateUrl:'./NotiModuleUpdateForm.Component.html'
})
export class NotiModuleUpdateForm implements OnInit , OnDestroy{
    private unsubscribe: Subscription[] = [];
    userData :  IUserData;
    loading: boolean = false;
    saveButtonClickedFlag : true
    dataSource : NotiModule
    CompanyUsers : any[] = []
    users :string[]=[];

    NotiModuleForm: FormGroup = this.fb.group({
        id : [0],
        name : ["" , Validators.compose([Validators.required ])],
        usersIds : []
    });

    constructor(
        private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : notiModule,
        private userServices : UsersService,
        @Inject(MAT_DIALOG_DATA) public data: { NotiModuleModel: NotiModule })
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.dataSource = data.NotiModuleModel
            this.unsubscribe.push(udata);
        }
        ngOnInit(): void {
            this.userServices.GetCompanyUsers(this.userData.companyId)
            .subscribe(res => {
                this.CompanyUsers = res
            })
            this.NotiModuleForm.patchValue({
                id : this.dataSource.id,
                name : this.dataSource.name,
                usersIds : this.dataSource.users.map(ele => ele.id)
            })
        }
        ngOnDestroy(): void {
            this.unsubscribe.forEach(ele => ele.unsubscribe())
        }
        addOrUpdateModel(){
            if(this.NotiModuleForm.valid)
                {
                    this.services.UpdatenotiModule(this.NotiModuleForm.value)
                    .subscribe(res =>{
                        console.log(res)
                        this.toaster.openSuccessSnackBar(res.message); 
                    },
                    (err)=>{
                        console.log(err)
                        this.toaster.openWarningSnackBar(err.message);
                    })
                }
        }
}