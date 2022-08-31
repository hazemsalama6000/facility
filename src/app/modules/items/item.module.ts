import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { ItemRoutingModule } from './item.routing.module';
import { UnitConversionComponent } from './components/unit-conversion/unit-conversion.component';
import { UnitConversionUpsertComponent } from './components/unit-conversion/unit-conversion-upsert/unit-conversion-upsert.component';
import { UnitConversionListContentComponent } from './components/unit-conversion/unit-conversion-list-content/unit-conversion-list-content.component';


@NgModule({
	declarations: [UnitConversionComponent,
		UnitConversionUpsertComponent,
		UnitConversionListContentComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		ItemRoutingModule,
		TranslationModule,
		SharedModule,
		InlineSVGModule
	],
	providers: [DatePipe]
})
export class ItemModule { }
