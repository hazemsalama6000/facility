import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IRiffle } from '../../../models/IRiffle.interface';
import { IRiffles } from '../../../models/IRiffles.interface';
import { RifflesService } from '../../../services/riffles.service';

@Component({
  selector: 'app-viewitems',
  templateUrl: './viewitems.component.html',
  styleUrls: ['./viewitems.component.scss']
})
export class ViewitemsComponent implements OnInit {
  loading: boolean = false;
  riffleProfile: IRiffle = {} as IRiffle;
  paginator: any;
  userData: IUserData;
  unsubscribe: Subscription[] = [];

  constructor(
    private rifflesService: RifflesService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ViewitemsComponent>,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
    @Inject(MAT_DIALOG_DATA) public data: { model: IRiffles, IsShowItemNoCount: boolean }
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
    });
    this.unsubscribe.push(subuser);

    if (data.model) {
      rifflesService.getRiffleById(data.model.id).subscribe(res => {
        this.riffleProfile = res;
      })
    } else {

    }

  }

  ngOnInit() { }

  saveFinal(riffle: IRiffle) {
    console.log(riffle)
    this.confirmationDialogService.confirm(`تنبية تأكيد أكتمال جرد رقم ${riffle.number} `, `سوف يتم أكمال الجرد ولا يمكن التعديل علية`)
      .then((confirmed) => {
        if (confirmed) {

          this.rifflesService.updateFinalSave(riffle.id).subscribe((data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.rifflesService.bSubject.next(false);
              this.dialogRef.close();
              this.toaster.openSuccessSnackBar(data.data);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
          },
            (error: any) => {
              this.loading = false;
              console.log(error)
              if(error.data)
              this.toaster.openWarningSnackBar(error.message);
              else
              this.toaster.openWarningSnackBar(error);            })

        }
      })
      .catch(() => { console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)') });

  }


  saveSttelement(riffle: IRiffle) {
    console.log(riffle)

    this.confirmationDialogService.confirm(`تأكيد عملية التسوية`, `برجاء الانتباه بأنة سوف يتم عمل تسوية على جميع الاصناف سواء بالاضافة أو بالصرف`)
      .then((confirmed) => {
        if (confirmed) {

          this.rifflesService.updateSttelementSave(riffle.id).subscribe((data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.rifflesService.bSubject.next(false);
              this.dialogRef.close();
              this.toaster.openSuccessSnackBar(data.data);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
          },
            (error: any) => {
              this.loading = false;
              console.log(error)
              if(error.data)
              this.toaster.openWarningSnackBar(error.message);
              else
              this.toaster.openWarningSnackBar(error);            })

        }
      })
      .catch(() => { console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)') });
  }

}
