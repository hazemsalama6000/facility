import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  shareRoutingModule } from './share-routing.module';
import { TranslationModule } from '../i18n';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StateRegionComponent } from './Components/state_region/state_region.component';

import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { StateListContentComponent } from './Components/state_region/state/state_list_content/state_list_content.component';
import { StateUpsertComponent } from './Components/state_region/state/state_Upsert/state-upsert.component';
import { StateComponent } from './Components/state_region/state/state.component';
import { RegionComponent } from './Components/state_region/region/region.component';
import { RegionUpsertComponent } from './Components/state_region/region/region_Upsert/region-upsert.component';
import { RegionListContentComponent } from './Components/state_region/region/region_list_content/region_list_content.component';
import { DepartmentListContentComponent } from './Components/section_department/department/department_list_content/department_list_content.component';
import { DepartmentSectionComponent } from './Components/section_department/department_section..component';
import { DepartmentUpsertComponent } from './Components/section_department/department/department_upsert/department-upsert.component';
import { SectionComponent } from './Components/section_department/section/section.component';
import { SectionListContentComponent } from './Components/section_department/section/section_list_content/section_list_content.component';
import { SectionUpsertComponent } from './Components/section_department/section/section_Upsert/section-upsert.component';
import { Job_upsertComponent } from './Components/section_department/section/section_list_content/job_upsert/job_upsert.component';
import { DepartmentComponent } from './Components/section_department/department/department.component';


@NgModule({
  declarations: [
	
	StateRegionComponent,
	StateComponent,
	StateUpsertComponent,
	StateListContentComponent,
	
	RegionComponent,
	RegionUpsertComponent,
	RegionListContentComponent,
	
	DepartmentSectionComponent,

	DepartmentComponent,
	DepartmentUpsertComponent,
	DepartmentListContentComponent,

	SectionComponent,
	SectionListContentComponent,
	SectionUpsertComponent,
	Job_upsertComponent

],
  imports: [
    CommonModule,
    shareRoutingModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
	SharedModule
  ]
})
export class shareModule { }
