import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map, Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeResponse } from "src/app/modules/Committee/Models/CommitteeResponse";
import { CommitteeServices } from "src/app/modules/Committee/Services/Committee.Services";
import { CommitteeMemberService } from "src/app/modules/Committee/Services/CommitteeMembers.Service";

@Component({
    selector:'UpdateCmdDetailsDialog',
    templateUrl:'./UpdateCmdDetailsDialog.Compoent.html'
})
export class UpdateCmdDetailsDialogCompoent implements OnInit , OnDestroy{
    today = new Date();
    month = this.today.getMonth();
    year = this.today.getFullYear();

    Members : any[]




    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    CommitteeForm: FormGroup = this.fb.group({
        id: [0],
        commmitteeDate : [new Date(this.year, this.month, 1) , Validators.compose([Validators.required])],
        commmitteeType_Id : [0, Validators.compose([Validators.required])],
        discription : ['', Validators.compose([Validators.required])],
        members_Ids : [0]
      });
    constructor(private auth: AuthService,
        private toaster: toasterService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { CommitteeModel: CommitteeResponse },
        private services : CommitteeServices,
        private MemberServices : CommitteeMemberService)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
            if (data.CommitteeModel) {
                this.isEdit = true;
                console.log(this.data.CommitteeModel)
                this.CommitteeForm.patchValue({
                    id : data.CommitteeModel.id,
                    commmitteeDate : data.CommitteeModel.commmitteeDate,
                    commmitteeType_Id : data.CommitteeModel.commmitteeType_Id,
                    discription : data.CommitteeModel.discription,
                    members_Ids : data.CommitteeModel.members.map(x => x.id)
                });
            }
        }
    ngOnInit(): void {
            let MembersObservations = this.MemberServices.ListOfCommitteeMeembers()
                .subscribe(members => {
                    this.Members = members
                }, err =>{
                    console.log(err)
                })
                this.unsubscribe.push(MembersObservations)
    }
    ngOnDestroy(): void {
        this.unsubscribe.forEach(ele => ele.unsubscribe())
    }
        addOrUpdateCommitteeMember(){
            if(this.CommitteeForm.valid){
                let subs =  this.services.UpdateCommittee(this.CommitteeForm.value)
                    .subscribe(res => {
                        if(res.issuccess)
                            this.toaster.openSuccessSnackBar(res.message)
                        else
                            this.toaster.openErrorSnackBar(res.message)
                    },err => this.toaster.openErrorSnackBar(err))
                this.unsubscribe.push(subs)
            }
        }
}