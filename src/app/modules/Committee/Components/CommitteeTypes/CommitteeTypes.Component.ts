import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { CommitteeType } from "../../Models/CommitteeType";
import { CommitteeTypeService } from "../../Services/CommitteeType.Service";
import { AddCmtTypeDialogComponent } from "./Components/AddCmtTypeDialog/AddCmtTypeDialog.Component";
import { UpdateCmtTypeDetailsComponent } from "./Components/UpdateCmtTypeDialog/UpdateCmtTypeDialog.Component";

@Component({
    selector:'CommitteeTypeComponent',
    templateUrl:'./CommitteeTypes.Component.html'
})
export class CommitteeTypeComponent implements OnInit , OnDestroy{
    dataSource : CommitteeType[]
    totalRecord: number = 0;
    addButton: boolean = true;
	NameForAdd: string;
    displayedColumns: string[] = ['name' , 'action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    userdata:IUserData;
    private unsubscribe: Subscription[] = [];
    constructor(
        private CmtTypesServices : CommitteeTypeService,
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
            let dataObs = this.CmtTypesServices.ListOfCommitteeTypes()
                .subscribe(data => {this.dataSource = data})
            this.unsubscribe.push(dataObs)
        }
        OpenAddDialog(){
            this.dialog.open(AddCmtTypeDialogComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' })
        }
        openUpdateDialog(ele : CommitteeType){
            this.dialog.open(UpdateCmtTypeDetailsComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' , data:{CommitteeTypeModel:ele} })
        }
        deleteItem(ele : CommitteeType){
            this.CmtTypesServices.DeleteCommitteeTypes(ele)
                .subscribe(res => {
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                    this.toaster.openErrorSnackBar(res.message)
                },err => this.toaster.openErrorSnackBar(err))
        }
}