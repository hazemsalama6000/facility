import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeServices } from "src/app/modules/Committee/Services/Committee.Services";
import { CommitteeMemberService } from "src/app/modules/Committee/Services/CommitteeMembers.Service";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";

@Component({
    selector:'AddComtDialogComponent',
    templateUrl:'./AddDialog.Component.html'
})
export class AddComtDialogComponent implements OnInit ,OnDestroy{

    today = new Date();
    month = this.today.getMonth();
    year = this.today.getFullYear();

    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    Members : any[]
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
    public dialogRef: MatDialogRef<fcmconfigDialog>,
    private services : CommitteeServices,
    private MemberServices : CommitteeMemberService)
    {
        const udata = this.auth.userData.subscribe(res => this.userData = res);
        this.unsubscribe.push(udata);
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
            let datSubs = this.services.AddCommittee(this.CommitteeForm.value)
                .subscribe(res =>{
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                        this.toaster.openErrorSnackBar(res.message)
                },err => {this.toaster.openErrorSnackBar(err)})
            this.unsubscribe.push(datSubs)
        }
    }
}