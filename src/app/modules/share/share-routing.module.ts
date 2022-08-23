import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupIdNameComponent } from 'src/app/shared-module/Components/lookupId_name/lookupId_name.component';
import { DepartmentSectionComponent } from './Components/section_department/department_section..component';
import { StateRegionComponent } from './Components/state_region/state_region.component';

const routes: Routes = [
	
	    { path:'state_region' , component:StateRegionComponent } ,
        { path:'department_section',component:DepartmentSectionComponent }
	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class shareRoutingModule { }
