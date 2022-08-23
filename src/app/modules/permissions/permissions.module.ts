import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OnlineUsersComponent } from './components/onlineUsers/onlineUsers.component';
import { SearchOnlineUsersComponent } from './components/onlineUsers/search-online-users/search-online-users.component';
import { OnlineUsersDatatableComponent } from './components/onlineUsers/online-users-datatable/online-users-datatable.component';
import { UserLocationComponent } from './components/onlineUsers/online-users-datatable/user-locations/user-location.component';
import { SearchUserLogsComponent } from './components/userConnectionLogs/search-user-logs/search-user-logs.component';
import { UserLogsDatatableComponent } from './components/userConnectionLogs/users-logs-datatable/users-logs-datatable.component';
import { UserConnectionLogsComponent } from './components/userConnectionLogs/user-connection-logs.component';
import { UserLocationLogsComponent } from './components/userLocationLogs/user-Locations-logs.component';
import { SearchUserLocationLogsComponent } from './components/userLocationLogs/search-user-Locations-logs/search-user-Locations-logs.component';
import { UserLocationLogsOnMapComponent } from './components/userLocationLogs/user-locations-logs-onmap/user-location-logs-onmap.component';
import { GetusersComponent } from './components/users/getusers/getusers.component';
import { AddnewuserComponent } from './components/users/addnewuser/addnewuser.component';
import { AssignrolestousersComponent } from './components/users/assignrolestousers/assignrolestousers.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddnewroleComponent } from './components/roles/addnewrole/addnewrole.component';
import { GetrolesComponent } from './components/roles/getroles/getroles.component';
import { RoleprofileComponent } from './components/roles/roleprofile/roleprofile.component';
import { UpdateroleComponent } from './components/roles/updaterole/updaterole.component';
import { PermissionsComponent } from './components/permissions.component';
import { OverviewComponent } from './components/users/overview/overview.component';
import { TreepermissionComponent } from './components/roles/treepermission/treepermission.component';
import { AdminrolesComponent } from './components/roles/adminroles/adminroles.component';
import { ManagesidemenuComponent } from './components/managesidemenu/managesidemenu.component';
import { AddmenuComponent } from './components/managesidemenu/addmenu/addmenu.component';


@NgModule({
  declarations: [
	OnlineUsersComponent,
	SearchOnlineUsersComponent,
	OnlineUsersDatatableComponent,
	UserLocationComponent,
	SearchUserLogsComponent,
	UserLogsDatatableComponent,
	UserConnectionLogsComponent,
	UserLocationLogsComponent,
	SearchUserLocationLogsComponent,
	UserLocationLogsOnMapComponent,
	GetusersComponent,
	AddnewuserComponent,
	AssignrolestousersComponent,
	PermissionsComponent,
	AddnewroleComponent,
	GetrolesComponent,
	RoleprofileComponent,
	UpdateroleComponent,
	OverviewComponent,
	TreepermissionComponent,
	AdminrolesComponent,
	ManagesidemenuComponent,
	AddmenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
	PermissionsRoutingModule,
    TranslationModule,
	SharedModule,
	InlineSVGModule
	 ],
	 providers:[DatePipe]
})
export class PermissionsModule { }
