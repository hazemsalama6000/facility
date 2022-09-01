import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
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
  displayedColumns: string[] = ['name', 'dateFrom', 'dateTo', 'state'];
  dataSource: any;
  userdata: IUserData
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
        width: '50%',
      });
  }

  stopFinancialYear(model: IFinancialYear) {
    this.confirmationDialogService.confirm('من فضلك اكد ايقاف التفعيل', `هل تريد ايقاف تفعيل ${model.year} ? `)
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

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  // getting data and initialize data Source and Paginator
  getallData() {
    this.financial.GetFinancialYear(this.userdata.companyId).subscribe((data: IFinancialYear[]) => {
      this.dataSource = new MatTableDataSource<IFinancialYear>(data);
      this.dataSource.paginator = this.paginator;
      this.addButton = data.filter((x) => x.isActive).length == 0;
    });
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
