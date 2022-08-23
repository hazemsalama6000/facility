import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ICustomer } from '../models/customer.interface';
import { ITechnitianLog } from '../models/ITechnitianLog.interface';
import { CutomerService } from '../services/customer.service';

@Component({
	selector: 'app-setting',
	templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
	@HostBinding('class') class =
		'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
	@HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

	customerProfile: ICustomer = {} as ICustomer;

	@Output() emitter = new EventEmitter<ITechnitianLog>();
	@Output() emitForActiveProp = new EventEmitter<boolean>();
	@Input() set _Employee(value: ICustomer) {
		this.customerProfile = value;
	}

	constructor(private service: CutomerService, private dialog: MatDialog,private toaster: toasterService) { }

	ngOnInit(): void {
	}

	toggleActive() {
		if(this.customerProfile.id==undefined){
			this.toaster.openWarningSnackBar('اختر عميل');
			return;
		}
		this.service.toggleActive(this.customerProfile.id).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.customerProfile.isDataComplete = !this.customerProfile.isDataComplete;
				this.emitForActiveProp.emit(this.customerProfile.isDataComplete);
			},
			(error) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			}
		)
	}

}
