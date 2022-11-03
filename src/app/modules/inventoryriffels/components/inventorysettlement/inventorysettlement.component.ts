import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IRiffles, ICommmittee } from '../../models/IRiffles.interface';
import { RifflesService } from '../../services/riffles.service';
import { UpsertrifflesComponent } from '../riffles/upsertriffles/upsertriffles.component';
import { ViewcommitteeComponent } from '../riffles/viewcommittee/viewcommittee.component';
import { ViewitemsComponent } from '../riffles/viewitems/viewitems.component';
// import { ViewriffleitemsComponent } from './viewriffleitems/viewriffleitems.component';

@Component({
  selector: 'app-inventorysettlement',
  templateUrl: './inventorysettlement.component.html',
  styleUrls: ['./inventorysettlement.component.scss']
})
export class InventorysettlementComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'code', 'date', 'commmittee', 'stock',  'isSettlementDone', 'state', 'action'];
  dataSource: any;
  dropdownStock: LookUpModel[] = [];
  dropdownFinancialyear: LookUpModel[] = [];
  searchModel: ISearchRiffles = { StockEmployeeId: 0, PageNumber: 1, PageSize: 5, FinalSave: true, IsCountingPartial: null, IsSettlementDone: null };
  userData: IUserData;
  showbtn: boolean = false;
  totalRecord = 0;
  startDate: string;
  endDate: string;
  private unsubscribe: Subscription[] = [];

  constructor(
    private inventoryService: InventoryService,
    private rifflesService: RifflesService,
    private financialyearService: FinancialyearService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private toaster: toasterService,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.searchModel.StockEmployeeId = data.employeeId;

      let change = rifflesService.bSubject.subscribe(res => this.getRifflesData())
      this.unsubscribe.push(change)
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  fillDropdown() {
    this.inventoryService.getLookUpStocks(this.userData.branchId, 0, this.userData.employeeId).subscribe(res => this.dropdownStock = res);
    this.financialyearService.getLookUpFinancialYear(this.userData.companyId).subscribe(res => this.dropdownFinancialyear = res);
  }

  getRifflesData() {
    this.rifflesService.getRifflesData(this.searchModel).subscribe(res => {
      console.log(res.data.filter(x => x.finalSave == false).length)
      this.showbtn = res.data.filter(x => x.finalSave == false).length == 0;
      this.totalRecord = res.totalRecords;
      this.dataSource = new MatTableDataSource<IRiffles>(res.data);
      // this.dataSource.paginator = this.paginator;
    });
  }

  getRifflesByDate() {
    if (this.startDate && this.endDate) {
      this.searchModel.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.searchModel.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
      this.getRifflesData();
    } else {
      this.searchModel.StartDate = '';
      this.searchModel.EndDate = '';
      this.getRifflesData();
    }
  }

  clearSearch() {
    this.startDate = '';
    this.endDate = '';
    this.searchModel = { StockEmployeeId:this.userData.employeeId, PageNumber: 1, PageSize: 5, FinalSave: true, IsCountingPartial: false, IsSettlementDone: null };
    this.getRifflesData();
  }

  openDialog(item?: IRiffles) {
    this.dialog.open(ViewitemsComponent, {
      minWidth: '100%',
      height: '100vh',
      position: { right: '0' },
      data: { model: item, IsShowItemNoCount: false }
    })
  }

  openCommmittee(element: ICommmittee) {
    this.dialog.open(ViewcommitteeComponent, {
      minWidth: '50%',
      height: '70vh',
      data: { model: element }
    })
  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
    this.getRifflesData();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}


export interface ISearchRiffles {
  StockEmployeeId: number;
  FinancialYearId?: number;
  StockId?: number;
  IsSettlementDone?: boolean | null;
  IsCountingPartial?: boolean | null;
  FinalSave?: boolean | null;
  StartDate?: string;
  EndDate?: string;
  PageSize: number;
  PageNumber: number;
}

