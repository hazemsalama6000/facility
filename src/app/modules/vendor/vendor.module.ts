import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorComponent } from './components/vendor/vendor.component';
import { UpsertvendorComponent } from './components/vendor/upsertvendor/upsertvendor.component';
import { VendoractivityComponent } from './components/vendoractivity/vendoractivity.component';
import { UpsertvendoractivityComponent } from './components/vendoractivity/upsertvendoractivity/upsertvendoractivity.component';
import { VendorclassificationComponent } from './components/vendorclassification/vendorclassification.component';
import { UpsertvendorclassificationComponent } from './components/vendorclassification/upsertvendorclassification/upsertvendorclassification.component';
import { VendormaincompanyComponent } from './components/vendormaincompany/vendormaincompany.component';
import { UpsertvendormaincompanyComponent } from './components/vendormaincompany/upsertvendormaincompany/upsertvendormaincompany.component';

@NgModule({
  declarations: [
    VendorComponent,
    UpsertvendorComponent,
    VendoractivityComponent,
    UpsertvendoractivityComponent,
    VendorclassificationComponent,
    UpsertvendorclassificationComponent,
    VendormaincompanyComponent,
    UpsertvendormaincompanyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    VendorRoutingModule,
    TranslationModule,
    SharedModule,
    InlineSVGModule
  ],
  providers: [DatePipe]
})
export class VendorModule { }
