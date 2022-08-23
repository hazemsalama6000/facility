import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { CutomersComponent } from './cutomers.component';
import { ComplainsComponent } from './complains/complains.component';
import { CustomerReadingComponent } from './customer-reading/customer-reading.component';
import { UpdateRequestComponent } from './updates-request/updates-request.component';
import { BillDatatableComponent } from './customer-bills/customer-bill-datatable.component';

const routes: Routes = [
	{
		path: 'cutomerprofile',
		component: CutomersComponent,
		children: [
			
			{
				path: 'overview',
				component: OverviewComponent,
			},

			{
				path: 'complains/:customerId',
				component: ComplainsComponent
			},

			{
				path: 'reading/:customerId',
				component: CustomerReadingComponent
			},

			{
				path: 'updatelog/:customerId',
				component: UpdateRequestComponent
			},
			{
				path: 'bills/:customerId',
				component: BillDatatableComponent
			},
			
			/*	{
					path: 'employeeblocks',
					component: EmployeeBlocksComponent
				},*/
			
			{ path: '', redirectTo: 'overview', pathMatch: 'full' },
			{ path: '**', redirectTo: 'overview', pathMatch: 'full' },
		],
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CustomerRoutingModule { }
