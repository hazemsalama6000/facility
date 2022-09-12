import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { ITreeStockShelfs } from '../../models/ITreeStockShelfs.interface';
import { InventoryService } from '../../services/inventory.service';
import { StockShelfsService } from '../../services/StockShelfs.service';

@Component({
  selector: 'app-Internaldivisionstock',
  templateUrl: './Internaldivisionstock.component.html',
  styleUrls: ['./Internaldivisionstock.component.scss']
})
export class InternaldivisionstockComponent implements OnInit {

  saveButtonClickedFlag = false;
  dropdownStockData: LookUpModel[];
  userdata: IUserData
  private unsubscribe: Subscription[] = [];

  constructor(
    private stockShelfsService: StockShelfsService,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    let data = authService.userData.subscribe(res => {
      this.userdata = res;
      this.getlistOfStock();
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
        (res: ITreeStockShelfs[]) => this.stockShelfsService.stockShelfTree.next(res),
        (err) => console.log(err),
        () => { }
      )
    });
    this.unsubscribe.push(tree)
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
