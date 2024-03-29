import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { TranslationService } from 'src/app/modules/i18n';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { IFinancialYear } from '../../models/IFinancialYear.interface';
import { FinancialyearService } from '../../services/financialyear.service';
import { AddfinancialyearComponent } from './addfinancialyear/addfinancialyear.component';

@Component({
  selector: 'app-financialyear',
  templateUrl: './financialyear.component.html',
  styleUrls: ['./financialyear.component.scss']
})
export class FinancialyearComponent implements OnInit {
  addButton: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n','name', 'dateFrom', 'dateTo', 'state'];
  dataSource: any;
  userdata: IUserData;
  LastFinancialYearId: number;
  page = { PNum: 1, PSize: 10 }
  private unsubscribe: Subscription[] = [];

  constructor(
    private financial: FinancialyearService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      const datajob = this.financial.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);

  }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(AddfinancialyearComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%'
      });
  }

  toggleActiveDeactive(model: IFinancialYear) {
    let msg=model.isActive?'ايقاف':''
    this.confirmationDialogService.confirm(`من فضلك اكد ${msg} التفعيل`, `هل تريد ${msg} تفعيل ${model.year} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.financial.StopIsActiveFinancialYear(this.userdata.companyId, model.id).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.getallData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        }else 
        this.getallData();
      })
      .catch(() =>{this.getallData(); console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')});
  }

  // getting data and initialize data Source and Paginator
  getallData() {
    this.financial.GetFinancialYear(this.userdata.companyId).subscribe((data: IFinancialYear[]) => {
      this.dataSource = new MatTableDataSource<IFinancialYear>(data);
      this.dataSource.paginator = this.paginator;
      this.addButton = data.filter((x) => x.isActive).length == 0;
      this.LastFinancialYearId = data.sort(function (a, b) { return b.id - a.id; })[0].id;
    });
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageEvent(event: any) {
    this.page.PSize = event.pageSize;
    this.page.PNum = event.pageIndex + 1;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
