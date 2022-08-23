import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { IIssueDisplayStatics } from '../../models/IIssueDisplayStatics.interface';
import { StaticsService } from '../../services/statics.service';

@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component implements OnInit{


	dailyStatics: IIssueDisplayStatics[];

	constructor(private service: StaticsService, private auth: AuthService, private datePipe: DatePipe) { }

	ngOnInit(): void {
		this.auth.userData.subscribe((data) => {

			this.service.getIssuesTweleveStatic(data.companyId).subscribe((data: IIssueDisplayStatics[]) => {
				this.dailyStatics = data;
			});
		});


	}
}
