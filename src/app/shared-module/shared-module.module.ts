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
import { PrimengModule } from './PrimengModule';
import { ConfirmationService } from 'primeng/api';

@NgModule({
	declarations: [
		UpsertComponent,
		ListContentComponent,
		LookupIdNameComponent,
		ConfirmationDialogComponent
	],
	imports: [
		MaterialsModules,
		PrimengModule,
		CommonModule,
		TranslationModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	],
	exports: [
		MaterialsModules,
		PrimengModule,
		UpsertComponent,
		ListContentComponent,
		LookupIdNameComponent,
		ConfirmationDialogComponent
	],
	entryComponents: [ConfirmationDialogComponent],
	providers: [ ConfirmationService,
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
	]
})
export class SharedModule { }
