import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { IDisplayDailyStaticsPerEmp } from '../../models/IDisplayDailyStaticsPerEmp.interface';
import { StaticsService } from '../../services/statics.service';
import { ISearchModel } from '../../models/ISearchModel.interface'
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { map, merge, switchMap } from 'rxjs';
@Component({
	selector: 'app-tables-widget10',
	templateUrl: './tables-widget10.component.html',
})
export class TablesWidget10Component implements OnInit {

	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	companyId: number;
	dailyStatics: IDisplayDailyStaticsPerEmp[];

	constructor(private service: StaticsService, private auth: AuthService, private datePipe: DatePipe) { }

	ngOnInit(): void {
		
	}

	ngAfterViewInit() {
		this.auth.userData.subscribe((data) => {
			this.companyId = data.companyId
		
		merge(this.paginator.page,this.service.searchUpdate$)
			.pipe(
				switchMap(() => {
					let model: ISearchModel = { } as ISearchModel;
					model.StartDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy')!;
					model.EndDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy')!;
					model.PageNumber = this.paginator.pageIndex + 1;
					model.CompanyId= this.companyId;
					return this.service.getEmployeesStatic(model);
				}),
				map((data: IEmployeeStatics) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;
					if (data === null) {
						return [];
					}
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
			)
			.subscribe((data) => { this.dailyStatics = data;});

		this.service.searchUpdateAction.next(true);
	});
	}
}

export interface IEmployeeStatics {
	data: IDisplayDailyStaticsPerEmp[],
	totalRecords: number
}