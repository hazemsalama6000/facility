import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { InventoryOrderingRoutingModule } from './inventoryOrdering-routing.module';
import { SuperVisorOrderingComponent } from './components/superVisorOrdering/superVisorOrdering.component';
import { SuperVisorOrderingStatisticsComponent } from './components/superVisorOrdering/superVisorOrderingStatistics/superVisorOrderingStatistics.component';
import { SuperVisorOrdersComponent } from './components/superVisorOrdering/superVisorOrders/superVisorOrders.component';
import { SuperVisorOrderActivitiesComponent } from './components/superVisorOrdering/superVisorOrderActivities/superVisorOrderActivities.component';

@NgModule({
  declarations: [
    SuperVisorOrderingComponent,
    SuperVisorOrdersComponent,
    SuperVisorOrderingStatisticsComponent,
    SuperVisorOrderActivitiesComponent
  ],
  imports: [
    CommonModule,
    InventoryOrderingRoutingModule,
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
export class InventoryOrderingModule { }
