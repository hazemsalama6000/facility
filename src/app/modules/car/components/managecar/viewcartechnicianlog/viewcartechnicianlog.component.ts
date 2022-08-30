import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { Icar } from '../../../models/ICar.interface';
import { ICarLogs } from '../../../models/ICarLogs.interface';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-viewcartechnicianlog',
  templateUrl: './viewcartechnicianlog.component.html',
  styleUrls: ['./viewcartechnicianlog.component.scss']
})
export class ViewcartechnicianlogComponent implements OnInit {
  searchModel: any = { branchId: 0 };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['techname', 'drivername', 'fromDate', 'toDate', 'notes', 'type', 'state', 'action'];
  dataSource: any;
  userData: IUserData;
  model: Icar;
  url: string = localStorage.getItem('companyLink') as string;
  unsubscribe: Subscription[] = [];

  constructor(private carService: CarService) {
    const selected = this.carService.carModel.subscribe(res => {
      this.model = res;
      this.model.id > 0 ? this.getallData(res.id) : null;
    });
    this.unsubscribe.push(selected);
  }

  ngOnInit() {
  }

  getallData(carId: number) {
    this.carService.getHistoryCar(carId).subscribe((data: ICarLogs[]) => {
      this.dataSource = new MatTableDataSource<ICarLogs>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
