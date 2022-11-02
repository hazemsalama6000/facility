import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { CommitteeMember } from "src/app/modules/Committee/Models/CommitteeMember";
import { CommitteeRequest } from "src/app/modules/Committee/Models/CommitteeRequest";
import { CommitteeServices } from "src/app/modules/Committee/Services/Committee.Services";

@Component({
    selector:'DetailsCmtDialog',
    templateUrl:'./DetailsCmtDialog.component.html'
})
export class DetailsCmtDialogComponent implements OnInit , OnDestroy{
    loading: boolean = false;
    saveButtonClickedFlag = false;
    totalRecord: number = 0;
    isEdit: boolean = false;
    userData: IUserData;
    CommitteeModel : CommitteeRequest
    dataSource : any[]
    displayedColumns: string[] = ['name' , 'position' , 'phone'  , 'address' ];
    private unsubscribe: Subscription[] = [];
    constructor(private auth: AuthService,
        @Inject(MAT_DIALOG_DATA) public data: { CommitteeMemberModel: CommitteeRequest },private CommitteeService : CommitteeServices)
        {
            const udata = this.auth.userData.subscribe(res => this.userData = res);
            this.unsubscribe.push(udata);
            this.CommitteeModel = data.CommitteeMemberModel
        }
    ngOnDestroy(): void {
        this.unsubscribe.forEach(ele => ele.unsubscribe())
    }
    ngOnInit(): void {
        let dataSubscriptions = this.CommitteeService.GetCommitteeMembers(this.CommitteeModel)
        .subscribe(data => {
            this.dataSource = data
        })
        this.unsubscribe.push(dataSubscriptions)
    }
}