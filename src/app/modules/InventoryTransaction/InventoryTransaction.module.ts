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
import { DailytransactionsComponent } from './components/dailytransactions/dailytransactions.component';
import { AddtransactionComponent } from './components/dailytransactions/addtransaction/addtransaction.component';
import { AddserialsComponent } from './components/dailytransactions/addtransaction/addserials/addserials.component';
import { ReserveditemComponent } from './components/reserveditem/reserveditem.component';
import { TransactionrequestlistComponent } from './components/transactionrequestlist/transactionrequestlist.component';

@NgModule({
  declarations: [
    InventoryTransactionComponent,
    TransactionlistComponent,
    DailytransactionsComponent,
    AddtransactionComponent,
    AddserialsComponent,
    ReserveditemComponent,
    TransactionrequestlistComponent
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
