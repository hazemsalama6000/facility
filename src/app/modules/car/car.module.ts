import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CarRoutingModule } from './car.routing.module';
import { ManagecarComponent } from './components/managecar/managecar.component';
import { UpsertcarComponent } from './components/managecar/upsertcar/upsertcar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { Car_list_contentComponent } from './components/managecar/car_list_content/car_list_content.component';
import { AssgincarComponent } from './components/managecar/assgincar/assgincar.component';
import { ViewcartechnicianlogComponent } from './components/managecar/viewcartechnicianlog/viewcartechnicianlog.component';
import { UnassigncarComponent } from './components/managecar/unassigncar/unassigncar.component';
import { CarExpenseTransactionDatatableComponent } from './components/carexpensetransactions/update-datatable/car-expense-transactions-datatable.component';
import { CarExpensesTransactionComponent } from './components/carexpensetransactions/car-expenses-transactions.component';
import { ViewimagesForCustomerComponent } from './components/carexpensetransactions/update-datatable/viewimages/viewimages.component';
import { CarTransactionUpsertComponent } from './components/carexpensetransactions/expense-transaction-upsert/expense-transaction-upsert.component';


@NgModule({
  declarations: [
	CarExpenseTransactionDatatableComponent,
	CarExpensesTransactionComponent,
	ViewimagesForCustomerComponent,
	CarTransactionUpsertComponent,
    ManagecarComponent,
    UpsertcarComponent,
    Car_list_contentComponent,
    AssgincarComponent,
    ViewcartechnicianlogComponent,
    UnassigncarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarRoutingModule,
    TranslationModule,
    SharedModule,
    InlineSVGModule
  ],
  providers: [DatePipe]
})
export class CarModule { }
