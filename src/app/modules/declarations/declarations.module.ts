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

@NgModule({
  declarations: [
    FinancialyearComponent,
    AddfinancialyearComponent,
    PathrouteComponent,
    AddpathrouteComponent,
    AssigntechnicianComponent,
    AddinventorycategoryComponent,
    InventorycategoryComponent
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
