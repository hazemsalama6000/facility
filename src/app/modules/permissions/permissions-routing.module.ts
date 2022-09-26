import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagesidemenuComponent } from './components/managesidemenu/managesidemenu.component';
import { OnlineUsersComponent } from './components/onlineUsers/onlineUsers.component';
import { PermissionsComponent } from './components/permissions.component';
import { AdminrolesComponent } from './components/roles/adminroles/adminroles.component';
import { GetrolesComponent } from './components/roles/getroles/getroles.component';
import { RoleprofileComponent } from './components/roles/roleprofile/roleprofile.component';
import { UserConnectionLogsComponent } from './components/userConnectionLogs/user-connection-logs.component';
import { UserLocationLogsComponent } from './components/userLocationLogs/user-Locations-logs.component';
import { GetusersComponent } from './components/users/getusers/getusers.component';
import { OverviewComponent } from './components/users/overview/overview.component';

const routes: Routes = [
	{ path: 'onlineUsers', component: OnlineUsersComponent },
	{ path: 'userconnectionlogs', component: UserConnectionLogsComponent },
	{ path: 'superadminroles', component: AdminrolesComponent },
	{ path: 'userLocationLogs', component: UserLocationLogsComponent },
	{ path: 'managemenu', component: ManagesidemenuComponent },
	//
	{
		path: '',
		component: PermissionsComponent,
		children: [
			{
				path: 'users',
				component: GetusersComponent,
			},
			{
				path: 'roles',
				component: GetrolesComponent,
			},
			{
				path: 'roleprofile',
				component: RoleprofileComponent,
			},
			{
				path: 'overview',
				component: OverviewComponent,
			},
			{ path: '', redirectTo: 'users', pathMatch: 'full' },
			{ path: '**', redirectTo: 'users', pathMatch: 'full' },
		],
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PermissionsRoutingModule { }
