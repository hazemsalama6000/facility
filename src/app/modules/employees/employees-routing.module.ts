import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EmployeesComponent } from './employees.component';
import { technicianLogComponent } from './technician-log/technician-log.component';
import { UserLocationComponent } from './user-locations/user-location.component';
import { Employee_listComponent } from '../customers/employee-list/employee-list.component';

const routes: Routes = [

	{
		path: 'employeeprofile',
		component: EmployeesComponent,
		children: [
			{
				path: 'overview',
				component: OverviewComponent,
			},
			{
				path: 'technicianlog/:employeeId',
				component: technicianLogComponent
			},
			{
				path: 'userlocation/:employeeId',
				component: UserLocationComponent
			},

			{ path: '', redirectTo: 'overview', pathMatch: 'full' },
			{ path: '**', redirectTo: 'overview', pathMatch: 'full' },
		],
	},
	{ path: 'employeelist', component: Employee_listComponent },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeesRoutingModule { }
