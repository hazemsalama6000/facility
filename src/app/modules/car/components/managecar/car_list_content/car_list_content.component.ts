import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { Icar, IcarPagination } from '../../../models/ICar.interface';
import { ICarSearch } from '../../../models/ICarSearch.interface';
import { CarService } from '../../../services/car.service';
import { AssgincarComponent } from '../assgincar/assgincar.component';
import { UnassigncarComponent } from '../unassigncar/unassigncar.component';
import { UpsertcarComponent } from '../upsertcar/upsertcar.component';

@Component({
  selector: 'app-car_list_content',
  templateUrl: './car_list_content.component.html',
  styleUrls: ['./car_list_content.component.scss']
})
export class Car_list_contentComponent implements OnInit {

  addButton: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['model', 'plateCar', 'techname', 'drivername', 'downloadfiles', 'action'];
  dataSource: any;
  userdata: IUserData
  searchModel: ICarSearch = { PageSize: 5, PageNumber: 1, branchId: 0 };
  totalRecord: number = 0;
  currentSelected: Icar = { id: 0 };
  url: string = localStorage.getItem('companyLink') as string;
  private unsubscribe: Subscription[] = [];
  dropdownCarModelData: LookUpModel[] = [];
  dropdownTechnicianData: LookUpModel[] = [];

  constructor(
    private carService: CarService,
    private technicianService: TechnicianService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      this.searchModel.branchId = res.branchId;
      this.getTechnician();
      this.getCarModel();
      const datajob = this.carService.bSubject.subscribe(data => { this.getallData(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() { }

  getallData() {
    this.carService.getCars(this.searchModel).subscribe((data: IcarPagination) => {
      this.dataSource = new MatTableDataSource<Icar>(data.data);
      this.dataSource.paginator = this.paginator;
      this.totalRecord = data.totalRecords
    });
  }

  pageEvent(event: any) {
    console.log(event);
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getallData();
  }

  getCarModel() {
    this.carService.getLookUpCarModel(this.userdata.companyId).subscribe(
      (res: LookUpModel[]) => this.dropdownCarModelData = res,
      (err) => console.log(err),
      () => { });
  }

  getTechnician() {
    this.technicianService.getLookUpTechnician(this.userdata.branchId).subscribe(
      (res: LookUpModel[]) => this.dropdownTechnicianData = res,
      (err) => console.log(err),
      () => { });
  }

  rowClicked(model: Icar) {
    this.currentSelected = model;
    this.carService.carModel.next(model);
  }

  openAddDialog(model?: Icar) {
    this.dialog.open(UpsertcarComponent, { maxHeight: '100vh', minHeight: '50%', width: '50%', data: { carModel: model } });
  }

  openAssignDialog(model: Icar, type: string) {
    this.dialog.open(AssgincarComponent, {
      maxHeight: '100vh',
      minHeight: '50%',
      width: '50%',
      data: { carModel: model, isTechnician: type == "technician" ? true : false }
    });
  }

  openunAssignTechincian(model: Icar, type: string) {
    this.dialog.open(UnassigncarComponent, {
      maxHeight: '100vh',
      minHeight: '50%',
      width: '50%',
      data: { carModel: model, isTechnician: type == "technician" ? true : false }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
