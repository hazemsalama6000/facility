import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeTypeService } from "src/app/modules/Committee/Services/CommitteeType.Service";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'AddCmtTypeDialogComponent',
    templateUrl:'./AddCmtTypeDialog.Component.html'
})
export class AddCmtTypeDialogComponent {
    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    CommitteeMemberForm: FormGroup = this.fb.group({
        id: [0],
        name : ["" , Validators.compose([Validators.required ])],
      });
      constructor(private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : CommitteeTypeService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
        }
    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
    addOrUpdateCommitteeMember(){
        if(this.CommitteeMemberForm.valid){
            this.services.AddCommitteeTypes(this.CommitteeMemberForm.value)
                .subscribe(res =>{
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                        this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
        }
    }
}