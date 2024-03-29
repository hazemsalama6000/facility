import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BranchComponent } from './components/branches/branch.component';
import { BranchUpsertComponent } from './components/branches/branch_Upsert/branch-upsert.component';
import { BranchListContentComponent } from './components/branches/branch_list_content/branch_list_content.component';
import { ClientUpsertComponent } from './components/client-profile/client-datalist/client-item/client-upsert/client-upsert.component';
import { ClientItemComponent } from './components/client-profile/client-datalist/client-item/client-item.component';
import { ClientDataListComponent } from './components/client-profile/client-datalist/client-dataList.component';
import { ClientComponent } from './components/client-profile/client.component';
import { ClientUpdateComponent } from './components/client-profile/client-datalist/client-item/client-update/client-update.component';
import { BranchAssignPathComponent } from './components/branches/branch_list_content/branch_AssignPathRoutes/branch_AssignPathRoutes.component';
import { BranchPathRoutesLogs } from './components/branches/branch_list_content/branch_pathroutes_logs/branch_pathroutes_logs.component';
import{BranchsAssignPathRouteComponent} from './components/client-profile/client-datalist/branchs_assignPathRoute/branchs_assignPathRoute.component'
import { ClientImportExcel } from './components/client-import-excel/client-import-excel.component';
import { ItemsImportExcel } from './components/items-import-excel/items-import-excel.component';

@NgModule({
  declarations: [
	ClientComponent,
	ClientDataListComponent,
	ClientItemComponent,
	ClientUpsertComponent,
	ClientUpdateComponent,	
	BranchAssignPathComponent,
	BranchPathRoutesLogs,
    BranchComponent,
    BranchUpsertComponent,
    BranchListContentComponent,
    BranchUpsertComponent
	,BranchsAssignPathRouteComponent,
	ClientImportExcel,
	ItemsImportExcel
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class ClientModule { }
