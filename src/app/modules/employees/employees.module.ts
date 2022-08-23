import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { SettingComponent } from './setting/setting.component';
import { OverviewComponent } from './overview/overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EditemployeeComponent } from './editemployee/editemployee.component';
import { Employee_listComponent } from './employee-list/employee-list.component';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { TranslationModule } from '../i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddTechnitianLogComponent } from './setting/Add-technitian-Log/add-technitian-Log.component';
import { TechnitianService } from './services/technitian.service';
import { technicianLogComponent } from './technician-log/technician-log.component';
import { UserLocationComponent } from './user-locations/user-location.component';
import { EmployeeBlocksComponent } from './employee-blocks/employee-blocks.component';
import { ComplainsComponent } from './complains/complains.component';
import { CustomerReadingComponent } from './customer-reading/customer-reading.component';
import { UserLocationXYComponent } from './user-locationsxy/user-locationxy.component';
import { UpdateRequestComponent } from './updates-request/updates-request.component';
import { BillDatatableComponent } from './employee-bills/customer-bill-datatable.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    SettingComponent,
    OverviewComponent,
    EditemployeeComponent,
    Employee_listComponent,
    AddTechnitianLogComponent,
    technicianLogComponent,
    UserLocationComponent,
	EmployeeBlocksComponent,
	ComplainsComponent,
	CustomerReadingComponent,
	UserLocationXYComponent,
	UpdateRequestComponent,
	BillDatatableComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    InlineSVGModule,
    TranslationModule,
    NgApexchartsModule,
    SharedModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [TechnitianService,DatePipe]

})
export class EmployeesModule { }
