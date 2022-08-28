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

@NgModule({
  declarations: [
    ManagecarComponent,
    UpsertcarComponent
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
