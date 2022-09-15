import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { Icar } from '../../../models/ICar.interface';
import { ICarLog, ICarLogs } from '../../../models/ICarLogs.interface';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-viewcartechnicianlog',
  templateUrl: './viewcartechnicianlog.component.html',
  styleUrls: ['./viewcartechnicianlog.component.scss']
})
export class ViewcartechnicianlogComponent implements OnInit {
  searchModel: any = { branchId: 0 };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['type', 'fromDate', 'toDate', 'personname', 'notes', 'state', 'action'];
  dataSource: any;
  userData: IUserData;
  carLogs: ICarLogs;
  model: Icar;
  url: string = localStorage.getItem('companyLink') as string;
  unsubscribe: Subscription[] = [];

  constructor(private carService: CarService) {
    let selected = this.carService.carModel.subscribe(res => {
      this.model = res;
      if (this.model.id > 0 ) {
       let x= carService.bSubject.subscribe(res=> this.getallData(this.model.id));
       this.unsubscribe.push(x);
      }
    });
    this.unsubscribe.push(selected);
  }

  ngOnInit() {
  }

  getallData(carId: number) {
    console.log(carId)
    this.carService.getHistoryCar(carId).subscribe((data: ICarLogs) => {
      this.carLogs = data;
      this.dataSource = new MatTableDataSource<ICarLog>(data.allLogs);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
