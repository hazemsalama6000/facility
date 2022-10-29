import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InventoryriffelsComponent } from './inventoryriffels.component';
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

@NgModule({
  declarations: [
    InventoryriffelsComponent,
    RifflesComponent,
    UpsertrifflesComponent,
    ViewcommitteeComponent
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
