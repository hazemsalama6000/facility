import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { OrderStatus } from "../../Models/OrderStatus";
import { OrderStatusService } from "../../Services/OrderStatus.Service";
import { AddOrderStatusComponent } from "./AddOrderStatusDialog/AddOrderStatus.Component";
import { UpdateOrderStatusComponent } from "./UpdateOrderStatusDialog/UpdateOrderStatus.Component";

@Component({
    selector:'OrderStatus',
    templateUrl:'./OrderStatus.Component.html'
})
export class OrderStatusComponent implements OnInit , OnDestroy{
    dataSource : OrderStatus[]
    totalRecord: number = 0;
    addButton: boolean = true;
	NameForAdd: string;
    displayedColumns: string[] = ['name' ,'txtColor' , 'ordering' ,  'action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    userdata:IUserData;
    private unsubscribe: Subscription[] = [];
    constructor(
        private authService: AuthService,
        private confirmationDialogService: ConfirmationDialogService,
        private toaster: toasterService,
        private dialog: MatDialog,
        private service : OrderStatusService
    ){
        const udata=this.authService.userData.subscribe(res=>this.userdata=res);
		this.unsubscribe.push(udata);
    }
    ngOnInit(): void {
        let dataObs = this.service.GetAllOrderStatus()
                .subscribe(data => {this.dataSource = data})
        this.unsubscribe.push(dataObs)
    }
    ngOnDestroy(): void {
        this.unsubscribe.forEach(ele => ele.unsubscribe())
    }
    OpenAddDialog(){
        this.dialog.open(AddOrderStatusComponent , { maxHeight: '100vh', minHeight: '50%', width: '50%' })
    }
    openUpdateDialog(ele : OrderStatus){
        this.dialog.open(UpdateOrderStatusComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%' , data:{OrderStatusModel : ele}})
    }
    deleteItem(ele : OrderStatus){
        this.service.DeleteOrderStatus(ele)
            .subscribe(res => {
                if(res.issuccess)
                    this.toaster.openSuccessSnackBar(res.message)
                else{
                    this.toaster.openWarningSnackBar(res.message)
                }
            },err => {
                this.toaster.openErrorSnackBar(err)
            })
    }
}