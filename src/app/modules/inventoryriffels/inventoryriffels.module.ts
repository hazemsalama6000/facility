import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from '../i18n';
import { InventoryRiffelRoutingModule } from './inventoryriffles-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { RifflesComponent } from './components/riffles/riffles.component';
import { UpsertrifflesComponent } from './components/riffles/upsertriffles/upsertriffles.component';
import { ViewcommitteeComponent } from './components/riffles/viewcommittee/viewcommittee.component';
import { InventorysettlementComponent } from './components/inventorysettlement/inventorysettlement.component';
// import { ViewriffleitemsComponent } from './components/inventorysettlement/viewriffleitems/viewriffleitems.component';
import { ViewitemsComponent } from './components/riffles/viewitems/viewitems.component';
import { ItemsnocountingComponent } from './components/riffles/viewitems/itemsnocounting/itemsnocounting.component';
import { ItemscountingComponent } from './components/riffles/viewitems/itemscounting/itemscounting.component';

@NgModule({
  declarations: [
    RifflesComponent,
    UpsertrifflesComponent,
    ViewcommitteeComponent,
    InventorysettlementComponent,
    // ViewriffleitemsComponent,
    ViewitemsComponent,
    ItemsnocountingComponent,
    ItemscountingComponent
  ],
  imports: [
    CommonModule,
    InventoryRiffelRoutingModule,
    InlineSVGModule,
    TranslationModule,
    NgApexchartsModule,
    SharedModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DatePipe]
})
export class InventoryriffelsModule { }
