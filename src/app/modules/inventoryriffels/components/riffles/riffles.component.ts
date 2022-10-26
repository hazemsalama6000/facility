import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IRiffles } from '../../models/IRiffles.interface';
import { RifflesService } from '../../services/riffles.service';
import { UpsertrifflesComponent } from './upsertriffles/upsertriffles.component';

@Component({
  selector: 'app-riffles',
  templateUrl: './riffles.component.html',
  styleUrls: ['./riffles.component.scss']
})
export class RifflesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'code', 'date', 'commmittee', 'stock', 'isCountingPartial', 'action'];
  dataSource: any;
  dropdownStock: LookUpModel[] = [];
  searchModel: any = { itemId: 0 }
  page = { PNum: 1, PSize: 5 }
  userData: IUserData;
  showbtn: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(
    private inventoryService: InventoryService,
    private rifflesService: RifflesService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private toaster: toasterService,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.getRifflesData();
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  fillDropdown() {
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
  }

  getRifflesData() {
    this.rifflesService.getRifflesData(this.searchModel).subscribe(res => {
      console.log(res.filter(x=>x.finalSave==false).length)
      this.showbtn=res.filter(x=>x.finalSave==false).length==0;
      this.dataSource = new MatTableDataSource<IRiffles>(res);
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(item?: IRiffles) {
    this.dialog.open(UpsertrifflesComponent, {
      minWidth: '100%',
      height: '100vh',
      position: { right: '0' },
      data: { model: item }
    })
  }

  pageEvent(event: any) {
    this.page.PSize = event.pageSize;
    this.page.PNum = event.pageIndex + 1;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}


