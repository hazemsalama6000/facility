import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IRolesProfile } from 'src/app/modules/permissions/models/IRolesProfile.interface';
import { ITreeRoles } from 'src/app/modules/permissions/models/ITreeRoles.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { InternaldivisionService } from '../../services/internaldivision.service';

@Component({
  selector: 'app-Internaldivisionstock',
  templateUrl: './Internaldivisionstock.component.html',
  styleUrls: ['./Internaldivisionstock.component.scss']
})
export class InternaldivisionstockComponent implements OnInit {

  saveButtonClickedFlag = false;
  dropdownStockData: LookUpModel[];
  private unsubscribe: Subscription[] = [];

  constructor(
    private internaldivisionService: InternaldivisionService,
  ) {
    this.getlistOfStock();
  }

  ngOnInit(): void { }

  getlistOfStock() {
    this.internaldivisionService.getLookUpStock().subscribe(
      (res: LookUpModel[]) => { this.dropdownStockData = res },
      (err) => console.log(err),
      () => { }
    )
  }

  // removeParent(arr?: ITreeRoles[]) {
  //   arr?.map(x => {
  //     delete x.parent
  //     if ((x?.children?.length ?? 0) > 0) {
  //       this.removeParent(x?.children);
  //     }
  //   })
  // }

  onSelectStock(event: Event) { }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
