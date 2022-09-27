import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { AuthService } from '../auth';
import { IUserData } from '../auth/models/IUserData.interface';

@Component({
  selector: 'app-InventoryTransaction',
  templateUrl: './InventoryTransaction.component.html',
  styleUrls: ['./InventoryTransaction.component.scss']
})
export class InventoryTransactionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
