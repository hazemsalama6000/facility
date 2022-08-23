import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReadingListComponent } from './components/reading-list/reading-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from '../i18n';
import { OperationsRoutingModule } from './operations-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { ComplainListComponent } from './components/complain-list/complain-list.component';
import { ViewimagesComponent } from './components/complain-list/viewimages/viewimages.component';
import { CustomerUpdateManageComponent } from './components/customer-update-manage/customer-update-manage.component';
import { updateCustomerManageComponent } from './components/customer-update-manage/update-datatable/update-datatable.component';
import { UserLocationComponent } from './components/customer-update-manage/update-datatable/user-locations/user-location.component';
import { IssueComponent } from './components/issue/issue.component';
import { IssuemasterComponent } from './components/issue/issuemaster/issuemaster.component';
import { IssuedetailsComponent } from './components/issue/issuedetails/issuedetails.component';
import { ViewimagesForCustomerComponent } from './components/customer-update-manage/update-datatable/viewimages/viewimages.component';
import { ReceivedataComponent } from './components/receivedata/receivedata.component';
import { BillComponent } from './components/customer-bills/customer-bill.component';
import { BillDatatableComponent } from './components/customer-bills/update-datatable/customer-bill-datatable.component';

@NgModule({

  declarations: [
    ReadingListComponent,
    ComplainListComponent,
    ViewimagesComponent,
    CustomerUpdateManageComponent,
    updateCustomerManageComponent,
    UserLocationComponent,
    IssueComponent,
    IssuemasterComponent,
    IssuedetailsComponent,
	ViewimagesForCustomerComponent,
    ReceivedataComponent,
	BillComponent,
	BillDatatableComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslationModule,
    SharedModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OperationsRoutingModule,

  ],
  providers: [DatePipe]
})
export class OperationsModule { }
