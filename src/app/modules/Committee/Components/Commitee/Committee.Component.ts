import { Component, OnDestroy , OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { CommitteeResponse } from "../../Models/CommitteeResponse";
import { CommitteeServices } from "../../Services/Committee.Services";
import { AddComtDialogComponent } from "./Components/AddDialogComponent/AddDialog.Component";
import { DetailsCmtDialogComponent } from "./Components/DetailsCmtDialog/DetailsCmtDialog.component";
import { UpdateCmdDetailsDialogCompoent } from "./Components/UpdateDialogCompoent/UpdateCmdDetailsDialog.Compoent";

@Component({
    selector:'CommitteeComponent',
    templateUrl:'./Committee.Component.html'
})
export class CommitteeComponent  implements OnInit , OnDestroy{
    dataSource : CommitteeResponse[]
    totalRecord: number = 0;
    addButton: boolean = true;
	NameForAdd: string;
    displayedColumns: string[] = ['commmitteeDate' ,'discription'   , 'action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    userdata:IUserData;
    private unsubscribe: Subscription[] = [];

    constructor(
        private CmtServices : CommitteeServices,
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
            let dataRes =  this.CmtServices.GetAllCommittees()
                .subscribe(data => {this.dataSource = data})
            this.unsubscribe.push(dataRes);
        }
        OpenAddDialog(){
            this.dialog.open(AddComtDialogComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' })
        }
        openUpdateDialog(ele : CommitteeResponse){
            this.dialog.open(UpdateCmdDetailsDialogCompoent , { maxHeight: '100vh', minHeight: '50%', width: '50%' , data:{CommitteeModel : ele} })
        }
        deleteItem(ele : CommitteeResponse){
            let deletSubs = this.CmtServices.DeleteCommittee(ele)
                .subscribe(res => {
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                    this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
                this.unsubscribe.push(deletSubs);
        }
        openDetailsDialog(ele : CommitteeResponse){
            this.dialog.open(DetailsCmtDialogComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' , data:{CommitteeMemberModel : ele}})
        }
}