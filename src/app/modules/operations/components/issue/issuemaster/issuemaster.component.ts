import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { SectionService } from 'src/app/modules/share/Services/department_section/section.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IISsueMaster } from '../../../models/IISsueMaster.interface';
import { IssueService } from '../../../services/issue.service';

@Component({
  selector: 'app-issuemaster',
  templateUrl: './issuemaster.component.html',
  styleUrls: ['./issuemaster.component.scss']
})
export class IssuemasterComponent {

  currentSelected: IISsueMaster;
  displayedColumns: string[] = ['name', 'date', 'state'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userdata: IUserData;

  private unsubscribe: Subscription[] = [];

  constructor(private issueService: IssueService, private auth: AuthService, private toaster: toasterService) {
    //subscribe here to invoke when insert done in upsert component
    // const data = this.service.selectFromStore().subscribe(data => {
    // 	const udata = auth.userData.subscribe(res => { this.userdata = res; this.getallData(); })
    // 	this.unsubscribe.push(udata);
    // });
    // this.unsubscribe.push(data)
    this.currentSelected = { id: 0 };
    this.getallData();
  }


  // getting data and initialize data Source and Paginator
  getallData() {
    this.issueService.getIssueMasterData(true).subscribe(
      (data: IISsueMaster[]) => {
        this.dataSource = new MatTableDataSource<IISsueMaster>(data);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.log(err),
      () => { }
    );
  }

  rowClicked(model: IISsueMaster) {
    this.currentSelected = model;
    this.issueService.IssueMaster.next(model);
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.issueService.IssueMaster.next({ id: 0 });
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

}
