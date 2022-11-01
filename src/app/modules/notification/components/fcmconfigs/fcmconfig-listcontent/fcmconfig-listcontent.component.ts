import {  ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { RegionService } from "src/app/core-module/LookupsServices/region.service";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { FcmConfig } from "../../../models/fcmconfig/FcmConfig";
import { FcmConfigService } from "../../../services/notiFcmConfig.service";
import { MatDialog } from '@angular/material/dialog';
import { fcmconfigDialog } from "../fcmConfig-Dialog/fcmConfigDialog.component";
import { fcmconfigDebugDetails } from "../fcmconfig-DialogDetails/fcmconfig-DebugDetails.Component";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";



@Component({
    selector:"app-fcmconfiglistcontent",
    templateUrl:'./fcmconfig-listcontent.component.html',
	changeDetection:ChangeDetectionStrategy.OnPush
})
export class fcmconfiglistcontent  implements OnInit , OnDestroy{

    totalRecord: number = 0;
    addButton: boolean = true;
	NameForAdd: string;

	@Output() edit: EventEmitter<FcmConfig> = new EventEmitter();

	displayedColumns: string[] = ['projectId' , 'IsAndroid' , 'apiKey'  , 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata:IUserData;
	 private unsubscribe: Subscription[] = [];

     constructor(private service: FcmConfigService, private toaster: toasterService 
		, private confirmationDialogService: ConfirmationDialogService ,private regionService:RegionService ,private auth:AuthService,private dialog: MatDialog,) {

		const udata=this.auth.userData.subscribe(res=>this.userdata=res);
		this.unsubscribe.push(udata);
        this.getallData();
	}

    ngOnInit(){
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    getallData() {
        this.service.GetAllFcmConf().subscribe(
            (data: FcmConfig[]) => {
                this.dataSource = new MatTableDataSource<FcmConfig>(data);
                this.dataSource.paginator = this.paginator;
            }
        );
    }
    
    openUpdateDialog(model?: FcmConfig) {
        this.dialog.open(fcmconfigDialog, { height: '100vh' , minHeight: '50%', width: '50%', data: { fcmConfigModel: model } });
      }
    openDetailsDialog(model?: FcmConfig){
        this.dialog.open(fcmconfigDebugDetails, { maxHeight: '100vh', minHeight: '50%', width: '60%', data: { fcmConfigModel: model } });
    }
    deleteItem(model: FcmConfig){
        this.service.DeleteFcmConfig(model).subscribe((res : HttpReponseModel)=> {
            if(res.isSuccess){
                this.toaster.openSuccessSnackBar(res.message);
            }
            else{
                this.toaster.openWarningSnackBar(res.message);
              }
              this.getallData()
        })
    }

}