import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ICommmittee, ICommmitteeMember } from '../../../models/IRiffles.interface';

@Component({
  selector: 'app-viewcommittee',
  templateUrl: './viewcommittee.component.html',
  styleUrls: ['./viewcommittee.component.scss']
})
export class ViewcommitteeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['n', 'name', 'position', 'phone'];
  dataSource: any;
  searchModel: any = { PageNumber: 1, PageSize: 5 };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { model: ICommmittee }
  ) { 
    if(data.model.members){
      this.dataSource = new MatTableDataSource<ICommmitteeMember>(data.model.members);
      this.dataSource.paginator = this.paginator;
    }
    console.log(data)
  }

  ngOnInit() {
  }

  pageEvent(event: any) {
    this.searchModel.PageSize = event.pageSize;
    this.searchModel.PageNumber = event.pageIndex + 1;
  }

}
