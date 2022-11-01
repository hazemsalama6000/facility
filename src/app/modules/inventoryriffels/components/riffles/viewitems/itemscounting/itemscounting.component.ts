import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IItemRiffles } from 'src/app/modules/inventoryriffels/models/IRiffle.interface';
import { ICommmittee, ICommmitteeMember } from 'src/app/modules/inventoryriffels/models/IRiffles.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';

@Component({
  selector: 'app-itemscounting',
  templateUrl: './itemscounting.component.html',
  styleUrls: ['./itemscounting.component.scss']
})
export class ItemscountingComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<IItemRiffles>;
  @Input() set isSettlement(value: boolean) {
    if (value) {
      this.displayedColumns.push(...['stockQuantity', 'status'])
      this.showFilter = true
    }
  }

  @Input() set data(value: IItemRiffles[]) {
    if (value) {
      this.dataSource = new MatTableDataSource<IItemRiffles>(value);
      this.dataSource.paginator = this.paginator;
      this.itemsData = value;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'code', 'name', 'riffleQuantity'];
  dataSource: any;
  itemsData: IItemRiffles[] = []
  searchModel: any = { PageNumber: 1, PageSize: 5 };
  showFilter: boolean = false
  dropdownSettlement: any[] = [
    { Id: null, Name: 'الكل ' },
    { Id: true, Name: 'تسوية بالاضافة' },
    { Id: false, Name: 'تسوية بالصرف' },
  ];


  constructor() { }

  ngOnInit() { console.log(this.isSettlement) }

  filterData(event: any) {
    if (event) {
      (event.Id == null) ? this.dataSource.data = this.itemsData : this.dataSource.data = this.itemsData.filter(x => x.isIncreaseSettlement == event.Id);
    }
    else
      this.dataSource.data = this.itemsData;

    this.table.renderRows();
  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
  }

}
