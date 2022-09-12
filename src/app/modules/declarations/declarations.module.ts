import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from '../i18n';
import { DeclarationsRoutingModule } from './declaration.routing.module';
import { FinancialyearComponent } from './components/financialyear/financialyear.component';
import { AddfinancialyearComponent } from './components/financialyear/addfinancialyear/addfinancialyear.component';
import { PathrouteComponent } from './components/pathroute/pathroute.component';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { AddpathrouteComponent } from './components/pathroute/addpathroute/addpathroute.component';
import { AssigntechnicianComponent } from './components/pathroute/assigntechnician/assigntechnician.component';
import { AddinventorycategoryComponent } from './components/inventorycategory/addinventorycategory/addinventorycategory.component';
import { InventorycategoryComponent } from './components/inventorycategory/inventorycategory.component';
import { TransferingCompanyComponent } from './components/transfering-company/transfering-company.component';
import { TransferingCompanyUpsertComponent } from './components/transfering-company/transfering-company_upsert/transfering-company-upsert.component';
import { TransferingCompanyListContentComponent } from './components/transfering-company/transfering-company_list_content/transfering-company_list_content.component';
import { CarsModelsComponent } from './components/cars-models/cars-models.component';
import { CarsModelsUpsertComponent } from './components/cars-models/cars-models-upsert/cars-models-upsert.component';
import { CarsModelsListContentComponent } from './components/cars-models/cars-models-list-content/cars-models-list-content.component';
import { CarExpensesComponent } from './components/cars-expenses/car-expenses.component';
import { CarExpenseListContentComponent } from './components/cars-expenses/car-expense-upsert-list-content/car-expense-upsert-list-content.component';
import { CarExpenseUpsertComponent } from './components/cars-expenses/car-expense-upsert/car-expense-upsert.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AddinventoryComponent } from './components/inventory/addinventory/addinventory.component';
import { AssigntechtoinventoryComponent } from './components/inventory/assigntechtoinventory/assigntechtoinventory.component';
import { AddstocktechComponent } from './components/inventory/addstocktech/addstocktech.component';
import { AddinternaldivisionComponent } from './components/Internaldivisionstock/addinternaldivision/addinternaldivision.component';
import { InternaldivisionstockComponent } from './components/Internaldivisionstock/Internaldivisionstock.component';
import { InternaldivisiontreeComponent } from './components/Internaldivisionstock/internaldivisiontree/internaldivisiontree.component';
import { VoucherSerialsComponent } from './components/voucher-serials/voucher-serials.component';
import { VoucherSerialUpsertComponent } from './components/voucher-serials/voucher-serials-upsert/voucher-serials-upsert.component';
import { VoucherSerialsDatatableComponent } from './components/voucher-serials/voucher-serials-datatable/voucher-serials-datatable.component';

@NgModule({
  declarations: [
    FinancialyearComponent,
    AddfinancialyearComponent,
    PathrouteComponent,
    AddpathrouteComponent,
    AssigntechnicianComponent,
    AddinventorycategoryComponent,
    InventorycategoryComponent,
    TransferingCompanyComponent,
    TransferingCompanyUpsertComponent,
    TransferingCompanyListContentComponent,
    CarsModelsComponent,
    CarsModelsUpsertComponent,
    CarsModelsListContentComponent,
    CarExpensesComponent,
    CarExpenseListContentComponent,
    CarExpenseUpsertComponent,
    InventoryComponent,
    AddinventoryComponent,
    AssigntechtoinventoryComponent,
    AddstocktechComponent,
    AddinternaldivisionComponent,
    InternaldivisionstockComponent,
    InternaldivisiontreeComponent,
	VoucherSerialsComponent,
	VoucherSerialUpsertComponent,
	VoucherSerialsDatatableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DeclarationsRoutingModule,
    TranslationModule,
    SharedModule,
    InlineSVGModule
  ],
  providers: [DatePipe]
})
export class DeclarationsModule { }
