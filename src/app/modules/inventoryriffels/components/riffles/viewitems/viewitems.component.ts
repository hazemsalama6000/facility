import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
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

  saveFinal(id: number) {
    console.log(id)
    this.rifflesService.updateFinalSave(id).subscribe((data: HttpReponseModel) => {
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
        this.toaster.openWarningSnackBar(error.message);
      })
  }


  saveSttelement(id: number) {
    console.log(id)
    this.rifflesService.updateSttelementSave(id).subscribe((data: HttpReponseModel) => {
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
        this.toaster.openWarningSnackBar(error.message);
      })
  }

}
