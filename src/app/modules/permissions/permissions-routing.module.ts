import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupIdNameComponent } from 'src/app/shared-module/Components/lookupId_name/lookupId_name.component';
import { OnlineUsersComponent } from './components/onlineUsers/onlineUsers.component';
import { UserConnectionLogsComponent } from './components/userConnectionLogs/user-connection-logs.component';
import { UserLocationLogsComponent } from './components/userLocationLogs/user-Locations-logs.component';

const routes: Routes = [
	{path:'onlineUsers' , component:OnlineUsersComponent},
	{path:'userconnectionlogs' , component:UserConnectionLogsComponent },
	{path:'userLocationLogs' , component:UserLocationLogsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
