import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { FinancialyearService } from 'src/app/modules/declarations/services/financialyear.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { IItemProfile } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { UpsertrifflesComponent } from './upsertriffles/upsertriffles.component';

@Component({
  selector: 'app-riffles',
  templateUrl: './riffles.component.html',
  styleUrls: ['./riffles.component.scss']
})
export class RifflesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'itemCode', 'itemName', 'quantity'];
  dataSource: any;
  saveButtonClickedFlag: boolean = false;
  dropdownStock: LookUpModel[] = [];
  searchModel: any = { itemId: 0 }
  page = { PNum: 1, PSize: 5 }
  userData: IUserData;
  showbtn: number = 0;
  // items: IItemProfile[] = [];
  item: IItemProfile = {} as IItemProfile;
  private unsubscribe: Subscription[] = [];

  masterForm: FormGroup = this.fb.group({
    stock_Id: [null, Validators.compose([Validators.required])],
    documentDate: [new Date(), Validators.compose([Validators.required])],
    documentNumber: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    committee_Id: [''],
    financialYear_Id: ['']
  });

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private toaster: toasterService,
    private dialog: MatDialog
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);
    this.dataSource = new MatTableDataSource<IItemProfile>([]);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void { }

  fillDropdown() {
    this.inventoryService.getLookUpStocks(this.userData.branchId).subscribe(res => this.dropdownStock = res);
  }

  openDialog(item?: any) {
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
