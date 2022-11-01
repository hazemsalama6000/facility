import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IItemNoCount, IItemRiffles } from 'src/app/modules/inventoryriffels/models/IRiffle.interface';

@Component({
  selector: 'app-itemsnocounting',
  templateUrl: './itemsnocounting.component.html',
  styleUrls: ['./itemsnocounting.component.scss']
})
export class ItemsnocountingComponent implements OnInit {

  @Input() @Input() set data(value: IItemNoCount[]) {
    if (value) {
      this.dataSource = new MatTableDataSource<IItemNoCount>(value);
      this.dataSource.paginator = this.paginator;
    }
  } 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'code', 'name', 'barCode'];
  dataSource: any;
  searchModel: any = { PageNumber: 1, PageSize: 5 };


  constructor() { }

  ngOnInit() {  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
  }

}
