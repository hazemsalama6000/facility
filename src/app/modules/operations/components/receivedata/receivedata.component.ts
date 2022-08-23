import { Component, OnInit } from '@angular/core';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ReceivedataService } from '../../services/receivedata.service';

@Component({
  selector: 'app-receivedata',
  templateUrl: './receivedata.component.html',
  styleUrls: ['./receivedata.component.scss']
})
export class ReceivedataComponent implements OnInit {

  buttons = {
    btnGeographic: false,
    btnEmployee: true,
    btnCustomer: true,
    btnIssue: true,
  }

  constructor(private toaster: toasterService, private receiveData: ReceivedataService) { }

  ngOnInit() { }

  getGeographicData() {
    this.receiveData.syncGeographicData().subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          this.toaster.openSuccessSnackBar('تم سحب البيانات بنجاح');
          // this.buttons.btnGeographic=true
          this.buttons.btnEmployee = false;
        }
        else if (data.isExists)
          this.toaster.openWarningSnackBar(data.message);
      },
      (error: any) => {
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    )

  }

  getEmployeeData() {
    this.receiveData.syncEmployeeData().subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          // this.buttons.btnEmployee=true;
          this.buttons.btnCustomer = false;
          this.toaster.openSuccessSnackBar('تم سحب البيانات بنجاح');
        }
        else if (data.isExists)
          this.toaster.openWarningSnackBar(data.message);
      },
      (error: any) => {
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    )

  }

  getCustomerData() {
    this.receiveData.syncCustomerData().subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          // this.buttons.btnCustomer=true;
          this.buttons.btnIssue = false;
          this.toaster.openSuccessSnackBar('تم سحب البيانات بنجاح');
        }
        else if (data.isExists)
          this.toaster.openWarningSnackBar(data.message);
      },
      (error: any) => {
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    )

  }

  getIssueData() {
    this.receiveData.syncIssueData().subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          this.toaster.openSuccessSnackBar('تم سحب البيانات بنجاح');
        }
        else if (data.isExists)
          this.toaster.openWarningSnackBar(data.message);
      },
      (error: any) => {
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    )

  }

}
