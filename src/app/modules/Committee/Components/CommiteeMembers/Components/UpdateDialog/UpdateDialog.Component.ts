import { Component, Inject, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeMember } from "src/app/modules/Committee/Models/CommitteeMember";
import { CommitteeMemberService } from "src/app/modules/Committee/Services/CommitteeMembers.Service";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";


@Component({
    selector:'UpdateDialog',
    templateUrl:'./UpdateDialog.Component.html'
})
export class UpdateDialogComponent implements OnDestroy {
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
        @Inject(MAT_DIALOG_DATA) public data: { CommitteeMemberModel: CommitteeMember },
        public dialogRef: MatDialogRef<fcmconfigDialog>,
        private services : CommitteeMemberService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
            if (data.CommitteeMemberModel) {
                this.isEdit = true;
                this.CommitteeMemberForm.patchValue({
                    id : data.CommitteeMemberModel.id,
                    name : data.CommitteeMemberModel.name,
                    position : data.CommitteeMemberModel.position,
                    phone : data.CommitteeMemberModel.phone,
                    address : data.CommitteeMemberModel.address
                });
            }
        }

        ngOnDestroy() {
            this.unsubscribe.forEach((sb) => sb.unsubscribe());
        }
        addOrUpdateCommitteeMember(){
            if(this.CommitteeMemberForm.valid)
            {
                let UpdObs = this.services.UpdateCommitteeMeembers(this.CommitteeMemberForm.value)
                .subscribe(res => {
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else 
                        this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
                this.unsubscribe.push(UpdObs);
            }
        }
}