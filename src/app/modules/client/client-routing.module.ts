import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupIdNameComponent } from 'src/app/shared-module/Components/lookupId_name/lookupId_name.component';
import { BranchComponent } from './components/branches/branch.component';
import { ClientImportExcel } from './components/client-import-excel/client-import-excel.component';
import { ClientComponent } from './components/client-profile/client.component';

const routes: Routes = [
	{path:'clientprofile' , component:ClientComponent},
	{path:'clientimportexcel',component: ClientImportExcel}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
