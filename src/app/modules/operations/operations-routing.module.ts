import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupIdNameComponent } from 'src/app/shared-module/Components/lookupId_name/lookupId_name.component';
import { ComplainListComponent } from './components/complain-list/complain-list.component';
import { BillComponent } from './components/customer-bills/customer-bill.component';
import { CustomerUpdateManageComponent } from './components/customer-update-manage/customer-update-manage.component';
import { IssueComponent } from './components/issue/issue.component';
import { ReadingListComponent } from './components/reading-list/reading-list.component';
import { ReceivedataComponent } from './components/receivedata/receivedata.component';

const routes: Routes = [
	{path:'cutomerupdatemanage' , component:CustomerUpdateManageComponent},
	{path:'customerbills' , component:BillComponent},
    { path: 'readinglist', component: ReadingListComponent },
    { path: 'complainlist', component: ComplainListComponent },
    { path: 'compainType', component: LookupIdNameComponent, data: { page: 'compainType' } },
    {path:'issue',component:IssueComponent},
    {path:'receivedata',component:ReceivedataComponent}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperationsRoutingModule { }
