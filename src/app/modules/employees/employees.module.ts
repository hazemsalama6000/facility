import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { SettingComponent } from './setting/setting.component';
import { OverviewComponent } from './overview/overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EditemployeeComponent } from './editemployee/editemployee.component';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddTechnitianLogComponent } from './setting/Add-technitian-Log/add-technitian-Log.component';
import { TechnitianService } from './services/technitian.service';
import { technicianLogComponent } from './technician-log/technician-log.component';
import { UserLocationComponent } from './user-locations/user-location.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    SettingComponent,
    OverviewComponent,
    EditemployeeComponent,
	AddTechnitianLogComponent,
	technicianLogComponent,
	UserLocationComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    InlineSVGModule,
    NgApexchartsModule,
	SharedModule,
	TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers:[TechnitianService]
 
})
export class EmployeesModule { }
