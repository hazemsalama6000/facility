import { Component, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";
import { CommitteeMemberService } from "../../../../Services/CommitteeMembers.Service";

@Component({
    selector:'AddingDialog',
    templateUrl:'./AddingDialog.Component.html'
})
export class AddingDialogComponent implements OnDestroy{
    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    CommitteeMemberForm: FormGroup = this.fb.group({
        id: [0],
        name : ["" , Validators.compose([Validators.required ])],
        position : ["" , Validators.compose([Validators.required ])],
        phone : ["" , Validators.compose([Validators.required ])],
        address : ["" , Validators.compose([Validators.required ])]
      });
      constructor(private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : CommitteeMemberService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
        }
    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
    addOrUpdateCommitteeMember(){
        if(this.CommitteeMemberForm.valid){
            let AddObs = this.services.AddCommitteeMeembers(this.CommitteeMemberForm.value)
                .subscribe(res =>{
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                        this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
            this.unsubscribe.push(AddObs);
        }
    }
}