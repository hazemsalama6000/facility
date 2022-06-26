import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModules } from './AngularMaterialModules';
import { UpsertComponent } from './Components/lookupId_name/Upsert/upsert.component';
import { ListContentComponent } from './Components/lookupId_name/list_content/list_content.component';
import { LookupIdNameComponent } from './Components/lookupId_name/lookupId_name.component';
import { TranslationModule } from '../modules/i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationDialogComponent } from './Components/confirm-dialog/confirmation-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
	declarations: [
		UpsertComponent,
		ListContentComponent,
		LookupIdNameComponent,
		ConfirmationDialogComponent
	],
	imports: [
		MaterialsModules,
		CommonModule
		, TranslationModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	],
	exports: [
		MaterialsModules,
		UpsertComponent,
		ListContentComponent,
		LookupIdNameComponent,
		ConfirmationDialogComponent
	],
	entryComponents: [ConfirmationDialogComponent],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
	]
})
export class SharedModule { }
