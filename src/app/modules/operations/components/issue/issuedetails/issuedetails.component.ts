import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IIssueDetails } from '../../../models/IIssueDetails.interface';
import { IISsueMaster } from '../../../models/IISsueMaster.interface';
import { IssueService } from '../../../services/issue.service';

@Component({
	selector: 'app-issuedetails',
	templateUrl: './issuedetails.component.html',
	styleUrls: ['./issuedetails.component.scss']
})
export class IssuedetailsComponent {

	IssueMaster: IISsueMaster;
	displayedColumns: string[] = ['branchName', 'issueName', 'issueDetailsStatus', 'billStartNum', 'billEndNum'];
	dataSource: any;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	unsubscribe: Subscription[] = [];

	constructor(
		private issueService: IssueService,
		private toaster: toasterService
	) {

		let IssueMasterSub = issueService.IssueMaster.subscribe(res => {
			if (res.id > 0) {
				this.IssueMaster = res;
				this.getallData(res.id);
			}
		});

		this.unsubscribe.push(IssueMasterSub);
	}

	getallData(issueId: number) {
		this.issueService.getIssueDetailsData(issueId).subscribe(
			(data: IIssueDetails[]) => {
				this.dataSource = new MatTableDataSource<IIssueDetails>(data);
				this.dataSource.paginator = this.paginator;
			},
			(err) => console.log(err),
			() => { }
		);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}
