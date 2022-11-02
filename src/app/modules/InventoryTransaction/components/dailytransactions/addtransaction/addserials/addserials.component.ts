import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ISerial } from 'src/app/modules/InventoryTransaction/models/IAddTransaction.interface';
import { IItemProfile } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';

@Component({
  selector: 'app-addserials',
  templateUrl: './addserials.component.html',
  styleUrls: ['./addserials.component.scss']
})
export class AddserialsComponent implements OnInit {

  serials: serial[] = [];

  startSerial: string = '';
  endSerial: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddserialsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: IItemProfile, itemIndex: number },
    private toaster: toasterService
  ) { }

  ngOnInit() {
    if (this.data.item.serialItems.length == 0) {
      for (let index = 0; index < this.data.item.preconvertedQuantity; index++) this.serials.push({ serial: '' });
    } else if (this.data.item.serialItems.length == this.data.item.preconvertedQuantity) {
      this.serials.push(...this.data.item.serialItems);
    } else {
      for (let index = 0; index < (this.data.item.preconvertedQuantity - this.data.item.serialItems.length); index++)
        this.serials.push({ serial: '' });
      this.serials.push(...this.data.item.serialItems)
    }

  }

  generateSerials() {
    let num: number = parseInt(this.startSerial);
    if (!isNaN(num)) {
      num--;
      this.serials.map(x => {
        num++;
        x.serial = `${this.endSerial != '' ? this.endSerial + '-' : ''}${num.toString().padStart(this.startSerial.length, '0')} `.trim();
      })
    } else {
      this.startSerial == '' ? this.toaster.openWarningSnackBar('يجب ادخال بدء تسلسل') : this.toaster.openWarningSnackBar('يجب ادخال بدء تسلسل رقمى');
    }

  }

  saveSerial() {
    this.dialogRef.close({ itemIndex: this.data.itemIndex, serials: this.serials.filter(x => x.serial != '') });
  }

}


export interface serial {
  serial: string
}
