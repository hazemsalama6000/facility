import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InventoryTransactionComponent } from './InventoryTransaction.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { InventoryTransactionRoutingModule } from './InventoryTransaction-routing.module';
import { TransactionlistComponent } from './components/transactionlist/transactionlist.component';

@NgModule({
  declarations: [
    InventoryTransactionComponent,
    TransactionlistComponent
  ],
  imports: [
    CommonModule,
    InventoryTransactionRoutingModule,
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
export class InventoryTransactionModule { }
