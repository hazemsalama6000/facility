import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderComponent } from './components/addOrder/addOrder.component';

@Component({
  selector: 'app-clientOrdering',
  templateUrl: './clientOrdering.component.html',
  styleUrls: ['./clientOrdering.component.scss']
})
export class ClientOrderingComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(AddOrderComponent, {
      minWidth: '100%',
      height: '100vh',
      position: { right: '0' }
    })
  }

}
