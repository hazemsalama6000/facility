import { Component, Inject } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { fcmconfigDialog } from "src/app/modules/notification/components/fcmconfigs/fcmConfig-Dialog/fcmConfigDialog.component";
import { OrderStatus } from "../../../Models/OrderStatus";
import { OrderStatusService } from "../../../Services/OrderStatus.Service";

@Component({
    selector:'UpdateOrderStatus',
    templateUrl:'UpdateOrderStatus.Component.html'
})
export class UpdateOrderStatusComponent {
    loading: boolean = false;
    saveButtonClickedFlag = false;
    isEdit: boolean = false;
    userData: IUserData;
    private unsubscribe: Subscription[] = [];
    OrderStatusForm: FormGroup = this.fb.group({
        id: [0],
        name : ["" , Validators.compose([Validators.required ])],
        sysName : ["" , Validators.compose([Validators.required ])],
        txtColor : ["" , Validators.compose([Validators.required ])],
        Ordring : [0 , Validators.compose([Validators.required ])],
      });
    constructor(private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { OrderStatusModel: OrderStatus },
    public dialogRef: MatDialogRef<fcmconfigDialog>,
    private services : OrderStatusService)
    {
        console.log(this.data.OrderStatusModel)
        const udata = this.auth.userData.subscribe(res => this.userData = res);
        this.unsubscribe.push(udata);
        if (data.OrderStatusModel) {
            this.isEdit = true;
            this.OrderStatusForm.patchValue({
                id : data.OrderStatusModel.id,
                name : data.OrderStatusModel.name,
                sysName : data.OrderStatusModel.sysName,
                txtColor : data.OrderStatusModel.txtColor,
                Ordring : data.OrderStatusModel.ordring
            });
        }
    }
    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
    addOrUpdateOrderStatus(){
        if(this.OrderStatusForm.valid)
        {
            this.services.UpdateOrderStatus(this.OrderStatusForm.value)
                .subscribe(res => {
                    if(res.issuccess)
                        this.toaster.openSuccessSnackBar(res.message)
                    else
                        this.toaster.openWarningSnackBar(res.message)
                },err => {
                    this.toaster.openErrorSnackBar(err)
                })
        }
    }
}