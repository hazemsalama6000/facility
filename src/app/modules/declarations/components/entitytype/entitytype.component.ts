import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ITransType } from 'src/app/modules/InventoryTransaction/models/ITransType.interface';
import { InvTransactionService } from 'src/app/modules/InventoryTransaction/services/invTransaction.service';
import { IEntityTypeUpdate } from '../../models/IEntityTypeUpdate.interface';
import { EntitytypeService } from '../../services/entitytype.service';

@Component({
  selector: 'app-entitytype',
  templateUrl: './entitytype.component.html',
  styleUrls: ['./entitytype.component.scss']
})
export class EntitytypeComponent implements OnInit {

  saveButtonClickedFlag = false;

  dropdownTransType: ITransType[] = [];
  entitytype: IEntityTypeUpdate[] = [];
  userData: IUserData;
  private unsubscribe: Subscription[] = [];

  entityForm: FormGroup = this.fb.group({
    transTypeId: [null, [Validators.required]],
  });
  constructor(
    private invTransactionService: InvTransactionService,
    private entitytypeService: EntitytypeService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
  ) {
    let data = auth.userData.subscribe(res => {
      this.userData = res;
      this.fillDropdown();
    });
    this.unsubscribe.push(data);
  }

  ngOnInit(): void { }

  fillDropdown() {
    this.invTransactionService.getTransactionType().subscribe(res => {
      this.dropdownTransType = res;

    });
  }

  onSelectTransType(item: ITransType) {
    if (item) {
      this.entitytypeService.getTransTypeWithEntityType(item.id).subscribe((res: IEntityTypeUpdate[]) => {
        this.entityForm.patchValue({ companyId: item.id });
        this.entitytype = res;
      },
        (err) => console.log(err),
      )
    }
  }


  addEntityType() {
    if (this.entityForm.valid && this.saveButtonClickedFlag) {
      this.entitytypeService.manageTransTypeWithEntityType(this.entitytype).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.toaster.openSuccessSnackBar(data.message);
            this.saveButtonClickedFlag = false;
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          console.log(error);
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      );
    }

  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

