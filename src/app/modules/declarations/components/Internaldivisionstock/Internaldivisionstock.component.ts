import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonHttpService } from 'src/app/core-module/httpServices/CommonHttpService.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { ITreeStockShelfs } from '../../models/ITreeStockShelfs.interface';
import { InventoryService } from '../../services/inventory.service';
import { StockShelfsService } from '../../services/StockShelfs.service';
import { AddinternaldivisionComponent } from './addinternaldivision/addinternaldivision.component';

@Component({
  selector: 'app-Internaldivisionstock',
  templateUrl: './Internaldivisionstock.component.html',
  styleUrls: ['./Internaldivisionstock.component.scss']
})
export class InternaldivisionstockComponent implements OnInit {

  saveButtonClickedFlag = false;
  dropdownStockData: LookUpModel[];
  userdata: IUserData
  data: ITreeStockShelfs[] = [];
  stockId: number = 0;
  private unsubscribe: Subscription[] = [];

  constructor(
    private stockShelfsService: StockShelfsService,
    private inventoryService: InventoryService,
    private authService: AuthService,
    private http: CommonHttpService,
    public dialog: MatDialog,
  ) {
    let data = authService.userData.subscribe(res => {
      this.userdata = res;
      stockShelfsService.bSubject.subscribe(res => this.getlistOfStock());
    });
    this.unsubscribe.push(data);
  }

  ngOnInit(): void { }

  getlistOfStock() {
    this.inventoryService.getLookUpStocks(this.userdata.branchId).subscribe(
      (res: LookUpModel[]) => { this.dropdownStockData = res },
      (err) => console.log(err),
      () => { }
    )
  }

  onSelectStock(event: any) {
    this.stockShelfsService.StockId.next(event.Id);
    let tree = this.stockShelfsService.bSubject.subscribe(res => {
      this.stockShelfsService.getStockShelfsByStockId(event.Id).subscribe(
        (res: ITreeStockShelfs[]) => {
          this.stockId = event.Id;
          this.data = res;
          this.stockShelfsService.stockShelfTree.next(res);
        },
        (err) => console.log(err),
        () => { }
      )
    });
    this.unsubscribe.push(tree)
  }

  addItem() {
    // let obj = { id: 0, fromSerial: 601, toSerial: 699, financialYear_Id: 12, billType_Id: 1, technician_Id: 4, company_Id: 1 };
    // this.http.CommonPostRequests(obj, `${localStorage.getItem("companyLink")}/api/v1/bill/addbillsbook`).subscribe(
    //   (res) => { console.log(res) },
    //   (err) => { console.log(err) }
    // );
    let node = { id: 0, level: 0 }
    const dialogRef = this.dialog.open(AddinternaldivisionComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        minWidth: '50%',
        data: { node: node }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
