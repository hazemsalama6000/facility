import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { of, Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { CommitteeMember } from "../../Models/CommitteeMember";
import { CommitteeMemberService } from "../../Services/CommitteeMembers.Service";
import { AddingDialogComponent } from "./Components/AddingDialog/AddingDialog.Component";
import { UpdateDialogComponent } from "./Components/UpdateDialog/UpdateDialog.Component";

@Component({
    selector:'CommitteeMembersComponent',
    templateUrl:'./CommitteeMembers.Component.html'
})
export class CommitteeMembersComponent implements OnInit , OnDestroy{
    dataSource : CommitteeMember[]
    totalRecord: number = 0;
    addButton: boolean = true;
	NameForAdd: string;
    displayedColumns: string[] = ['name' , 'position' , 'phone'  , 'address' , 'action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    userdata:IUserData;
	private unsubscribe: Subscription[] = [];
    constructor(
        private ComtMembersServices : CommitteeMemberService,
        private authService: AuthService,
        private confirmationDialogService: ConfirmationDialogService,
        private toaster: toasterService,
        private dialog: MatDialog
        ){
            const udata=this.authService.userData.subscribe(res=>this.userdata=res);
		    this.unsubscribe.push(udata);
        }
    ngOnDestroy(): void {
        this.unsubscribe.forEach(ele => ele.unsubscribe())
    }
    ngOnInit(): void {
        let datSub = this.ComtMembersServices.GetAllCommitteeMeembers()
            .subscribe(data => {this.dataSource = data})
        this.unsubscribe.push(datSub)

    }
    OpenAddDialog(){
        this.dialog.open(AddingDialogComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' })
    }
    openUpdateDialog(ele : CommitteeMember){
        this.dialog.open(UpdateDialogComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' , data:{ CommitteeMemberModel: ele }} )
    }
    deleteItem(ele : CommitteeMember){
        let delSub = this.ComtMembersServices.DeleteCommitteeMeembers(ele)
            .subscribe(res => {
                if(res.issuccess)
                    this.toaster.openSuccessSnackBar(res.message)
                else
                    this.toaster.openErrorSnackBar(res.message)
            },err => this.toaster.openErrorSnackBar(err))
        this.unsubscribe.push(delSub)
    }
}