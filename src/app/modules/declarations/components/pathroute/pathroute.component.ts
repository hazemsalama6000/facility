import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RegionService } from 'src/app/core-module/LookupsServices/region.service';
import { StateService } from 'src/app/core-module/LookupsServices/state.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IPathRoute, IPathRoutePaginantion } from '../../models/IPathRoute.interface';
import { IPathRouteSearch } from '../../models/IPathRouteSearch.interface';
import { PathrouteService } from '../../services/pathroute.service';
import { AddpathrouteComponent } from './addpathroute/addpathroute.component';
import { AssigntechnicianComponent } from './assigntechnician/assigntechnician.component';

@Component({
  selector: 'app-pathroute',
  templateUrl: './pathroute.component.html',
  styleUrls: ['./pathroute.component.scss']
})
export class PathrouteComponent implements OnInit {

  addButton: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'state', 'region', 'technician', 'status', 'action'];
  dataSource: any;
  userdata: IUserData
  searchModel: IPathRouteSearch = { PageSize: 5, PageNumber: 1, CompanyBranchId: 0 };
  totalRecord: number = 0;
  private unsubscribe: Subscription[] = [];
  dropdownStateData: LookUpModel[] = [];
  dropdownRegionData: LookUpModel[] = [];
  dropdownPathRouteData: LookUpModel[] = [];

  constructor(
    private pathrouteService: PathrouteService,
    private stateService: StateService,
    private regionService: RegionService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      this.searchModel.CompanyBranchId = res.branchId;
      const datajob = this.pathrouteService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);

    this.getstate();
  }

  ngOnInit() {
  }

  getallData() {
    this.pathrouteService.getPathRoute(this.searchModel).subscribe((data: IPathRoutePaginantion) => {
      console.log(data)
      this.dataSource = new MatTableDataSource<IPathRoute>(data.data ?? []);
      this.dataSource.paginator = this.paginator;
      this.totalRecord = data.totalRecords
    });
  }

  getstate() {
    this.stateService.getLookupStateData().subscribe(
      (res: LookUpModel[]) => this.dropdownStateData = res,
      (err) => console.log(err),
      () => { });
  }

  getRegion(model: LookUpModel) {
    this.regionService.getLookupStateData(model.Id).subscribe(
      (res: LookUpModel[]) => this.dropdownRegionData = res,
      (err) => console.log(err),
      () => { });
    this.getPathRoute();
    this.getallData();
  }

  getPathRoute() {
    this.pathrouteService.getLookUpPathRoute({ StateId: this.searchModel.StateId, RegionId: this.searchModel.RegionId, CompanyBranchId: this.userdata.branchId }).subscribe(
      (res: LookUpModel[]) => this.dropdownPathRouteData = res,
      (err) => console.log(err),
      () => { });

    this.getallData();
  }

  changePathRoute(model: LookUpModel) {
    this.getallData();
  }

  toggleActiveDeactive(model: IPathRoute) {
    let stmt = model.isActive ? 'ايقاف تفعيل' : 'تفعيل';
    this.confirmationDialogService.confirm(`من فضلك اكد ${stmt}`, `هل تريد ${stmt} ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.pathrouteService.toggelIsActivePathRoute(model.id).subscribe(
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

  stopAssignTechincian(model: IPathRoute) {
    this.confirmationDialogService.confirm(`من فضلك اكد ألغاء المندوب`, `هل تريد ألغاء المندوب ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.pathrouteService.UnAssignTechincianToPathRoute(model.id).subscribe(
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

  pageEvent(event: any) {
    console.log(event);
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getallData();
  }

  openAddDialog(model?: IPathRoute) {
    this.dialog.open(AddpathrouteComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%', data: { model: model } });
  }

  openAssignDialog(model: IPathRoute) {
    this.dialog.open(AssigntechnicianComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%', data: { pathRoute: model } });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
