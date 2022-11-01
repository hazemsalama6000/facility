import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { IRolesProfile } from "src/app/modules/permissions/models/IRolesProfile.interface";
import { RolesService } from "src/app/modules/permissions/services/roles.service";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { NotiModule } from "../../models/NotiModule/NotiModule";
import { notiModule } from "../../services/notiModule.service";
import { NotiModuleForm } from "./NotiModuleForm/NotiModuleForm.Component";
import { NotiModuleUpdateForm } from "./NotiModuleUpdateForm/NotiModuleUpdateForm.Component";

@Component({
    selector:'NotiModule',
    templateUrl:'./NotiModule.Component.html'
})
export class NotiModuleComponent implements OnInit {

    rolesData: IRolesProfile;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    Data : NotiModule[] = []

    constructor(
        private services: notiModule,
        private authService: AuthService,
        private confirmationDialogService: ConfirmationDialogService,
        private toaster: toasterService,
        private dialog: MatDialog
      ) {
        let getdata = this.authService.userData.subscribe(
          res => {
            this.userData = res;
          });
    
        this.unsubscribe.push(getdata);
      }
    ngOnInit(): void {
        this.getdata();
    }
    
    getdata(){
        this.services.GetAllnotiModule().subscribe((res : NotiModule[])=>{
            this.Data = res;
        })
    }
    ShowEdit(ele:NotiModule){
      this.dialog.open(NotiModuleUpdateForm , { height: '50vh' ,  minHeight: '50%', width: '50%' , data:{ NotiModuleModel: ele }}) 
    }
    Delete(ele:NotiModule){
      this.services.DeletenotiModule(ele)
      .subscribe(res => {
        console.log(res)
        this.toaster.openSuccessSnackBar(res.message)
      },
      (err) => {
        console.log(err)
        this.toaster.openErrorSnackBar(err.message)
      })
    }
    ShowAddEle(){
      this.dialog.open(NotiModuleForm , { height: '50vh' ,  minHeight: '50%', width: '50%'})  
    }
}