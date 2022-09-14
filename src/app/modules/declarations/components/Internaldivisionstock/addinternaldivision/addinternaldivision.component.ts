import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { StockShelfsService } from '../../../services/StockShelfs.service';

@Component({
  selector: 'app-addinternaldivision',
  templateUrl: './addinternaldivision.component.html',
  styleUrls: ['./addinternaldivision.component.scss']
})
export class AddinternaldivisionComponent {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];



  stockTreeForm: FormGroup = this.fb.group({
    level: [0],
    name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    code: [null, Validators.compose([Validators.required])],
    parent_Id: [0],
    shelf: [null, Validators.compose([Validators.required])],
    stock_Id: [0],
  });



  constructor(
    private stockShelfsService: StockShelfsService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { node: any },
    public dialogRef: MatDialogRef<AddinternaldivisionComponent>
  ) {
    const stockIsdata = this.stockShelfsService.StockId.subscribe(res => this.stockTreeForm.patchValue({ stock_Id: res }));
    this.unsubscribe.push(stockIsdata);
  }

  addStockShelf() {

    if (this.stockTreeForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.stockTreeForm.patchValue({ parent_Id: this.data.node.id, level: this.data.node.level + 1 });
      console.log(this.stockTreeForm.value)
      this.stockShelfsService.addStockShelf(this.stockTreeForm.value).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            this.stockShelfsService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      );
    }

  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
