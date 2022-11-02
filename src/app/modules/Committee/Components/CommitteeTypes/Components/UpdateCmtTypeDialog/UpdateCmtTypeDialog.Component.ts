import { Component, Inject } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeType } from "src/app/modules/Committee/Models/CommitteeType";
import { CommitteeTypeService } from "src/app/modules/Committee/Services/CommitteeType.Service";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'UpdateCmtTypeDetailsComponent',
    templateUrl:'./UpdateCmtTypeDialog.Component.html'
})
export class UpdateCmtTypeDetailsComponent {
    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    CommitteeTypeForm: FormGroup = this.fb.group({
        id: [0],
        name : ["" , Validators.compose([Validators.required ])],
      });
    constructor(private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { CommitteeTypeModel: CommitteeType },
    public dialogRef: MatDialogRef<fcmconfigDialog>,
    private services : CommitteeTypeService)
    {
        const udata = this.auth.userData.subscribe(res => this.userData = res);
        this.unsubscribe.push(udata);
        if (data.CommitteeTypeModel) {
            this.isEdit = true;
            this.CommitteeTypeForm.patchValue({
                id : data.CommitteeTypeModel.id,
                name : data.CommitteeTypeModel.name
            });
        }
    }
    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
    addOrUpdateCommitteeMember(){
        if(this.CommitteeTypeForm.valid)
            this.services.UpdateCommitteeTypes(this.CommitteeTypeForm.value)
                .subscribe(res => {
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                        this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
    }
}