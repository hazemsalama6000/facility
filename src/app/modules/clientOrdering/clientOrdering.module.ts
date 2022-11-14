import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientOrderingComponent } from './clientOrdering.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from '../i18n';
import { clientOrderingRoutingModule } from './clientOrdering-Routing.Module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { OrdersComponent } from './components/orders/orders.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { OrderStatisticsComponent } from './components/orderStatistics/orderStatistics.component';
import { AddOrderComponent } from './components/addOrder/addOrder.component';
import { OrderStatusComponent } from './components/orderStatus/OrderStatus.Component';
import { AddOrderStatusComponent } from './components/orderStatus/AddOrderStatusDialog/AddOrderStatus.Component';
import { UpdateOrderStatusComponent } from './components/orderStatus/UpdateOrderStatusDialog/UpdateOrderStatus.Component';
import { ViewOrderStatusComponent } from './components/viewOrderStatus/viewOrderStatus.component';

@NgModule({
  declarations: [
    ClientOrderingComponent,
    OrdersComponent,
    ActivitiesComponent,
    OrderStatisticsComponent,
    AddOrderComponent,
    OrderStatusComponent,
    AddOrderStatusComponent,
    UpdateOrderStatusComponent,
    ViewOrderStatusComponent
  ],
  imports: [
    CommonModule,
    clientOrderingRoutingModule,
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
export class ClientOrderingModule { }
