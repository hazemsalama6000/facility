import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ClientBranchService } from 'src/app/modules/client/services/branch.service';
import { ClientService } from 'src/app/modules/client/services/client.service';
import { InventoryService } from 'src/app/modules/declarations/services/inventory.service';
import { ItemService } from 'src/app/modules/items/services/item.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IItemsForOrder, IOrderOperation } from '../../models/IItemsForOrder.interface';

@Component({
  selector: 'app-addOrder',
  templateUrl: './addOrder.component.html',
  styleUrls: ['./addOrder.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AddOrderComponent implements OnInit {


  columnsToDisplay = ['n', 'branchName', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IItemsForOrder | null;
  @ViewChild(MatTable) table: MatTable<IItemsForOrder>;
  loading: boolean = false;
  itemLoader: boolean = false;
  dataSource: IOrderOperation[] = [];
  // isLoadingResults = true;
  // isRateLimitReached = false;
  userData: IUserData;
  dropdownClient: LookUpModel[] = [];
  dropdownClientBranch: LookUpModel[] = [];
  // maxDate = new Date();
  // startDate: string;
  // endDate: string;
  searchItem: string;
  saveButtonClickedFlag: boolean = false;
  isReadOnly: boolean = false;
  private unsubscribe: Subscription[] = [];

  masterForm: FormGroup = this.fb.group({
    Id: [0],
    TotalPrice: [null],
    Notes: [''],
    OrderEmployee_Id: [null, Validators.compose([Validators.required])],
    ClientBranch_Id: [null, Validators.compose([Validators.required])],
    Client_Id: [null, Validators.compose([Validators.required])],
    OrderItems: [null]
  });

  detailsForm: FormGroup = this.fb.group({
    name: [''],
    // price: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
    quantity: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    unit: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
    CanChangeQuantity: [false],
    CanScaduled: [false],
    CanRefuse: [false],
  });

  constructor(
    private fb: FormBuilder,
    private clientBranch: ClientBranchService,
    private client: ClientService,
    private inventoryService: InventoryService,
    private itemService: ItemService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<AddOrderComponent>,
    private toaster: toasterService,
    // @Inject(MAT_DIALOG_DATA) public data: { model: IRiffles }
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data,
        this.masterForm.get('OrderEmployee_Id')?.setValue(this.userData.employeeId)
      this.fillDropdown();
    });
    this.unsubscribe.push(subuser);

  }

  ngOnInit(): void { }

  fillDropdown() {
    this.client.listOfClient(this.userData.employeeId).subscribe(res => this.dropdownClient = res);
  }

  onSelectClient(item: LookUpModel) {
    if (item) {
      this.clientBranch.listOfClientBranch(item.Id).subscribe(res => this.dropdownClientBranch = res);
    }
  }

  autoCompleteItems: LookUpModel[] = [];

  inputAutoComplete(text: string) {
    // if (this.masterForm.valid) {
    this.isReadOnly = true;
    this.detailsForm.get('price')?.enable();
    this.detailsForm.get('unit')?.enable();
    this.detailsForm.get('quantity')?.enable();

    this.autoCompleteItems = []
    if (text.length > 2) {
      this.itemLoader = true
      this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => {
        if (res)
          this.autoCompleteItems = res
        this.itemLoader = false;
      });

    }
    // } else
    //   this.toaster.openWarningSnackBar('برجاء استكمال البيانات الاساسية أولاً')
  }



  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';
  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    if (x.option.value.Id) {
      this.itemLoader = true;
      this.itemService.getItemProfileForOrder(x.option.value.Id, this.userData.companyId).subscribe(res => {
        if (res) {

          let branches: LookUpModel[] = [{ Id: 1, Name: 'cairo' }, { Id: 2, Name: 'ddd' }];
          if (branches.length > 0) {

            branches.map(branch => {
              let order: IOrderOperation = {} as IOrderOperation;
              order.branchId = branch.Id;
              order.branchName = branch.Name;

              this.dataSource.push(order);
              this.table.renderRows();
            });

          }

          // let index = 0//this.dataSource.data.findIndex((x: any) => x.itemData_Id == res.id);
          // //console.log(this.dataSource.data, res)
          // if (index > -1)
          //   this.toaster.openWarningSnackBar('هذا الصنف تم اضاقته من قبل')
          // else {
          //   if (res) {

          //   }


          // }
          this.itemLoader = false;
        }
        this.itemLoader = false;
      }, (err) => { this.toaster.openWarningSnackBar(err); this.itemLoader = false; })
    }
  }

  AddItem() {
    if (this.detailsForm.valid) {

      // this.item.quantity = this.detailsForm.get('quantity')?.value;

      // if (this.item.quantity < 1) {
      //   this.detailsForm.get('quantity')?.setErrors(Validators.pattern("^[0-9]*$"))
      //   return;
      // }

      // this.item.price = this.detailsForm.get('price')?.value;
      // this.item.total = this.item.quantity * this.item.price;
      // this.items.push(this.item);
      // this.item = {} as IItemProfile;
      // this.convertedUnits = [];
      // this.detailsForm.reset();
      // this.detailsForm.get('price')?.setValue(null)
      // this.detailsForm.get('quantity')?.setValue(null)
      // this.detailsForm.get('unit')?.setValue(null)
      // this.searchItem = '';
      // this.dataSource.data=this.items;
      // this.dataSource.paginator = this.paginator;
      // this.table.renderRows();
    }
  }

  deleteItem(index: number) {
    // this.dataSource.data.splice(index, 1);
    // this.dataSource.paginator = this.paginator;
    // this.table.renderRows();
  }

  addRiffle() {

    // let obj = this.createObject(this.dataSource.data as IItemRiffles[]);

    // console.log(JSON.stringify(obj))

    // if (obj.items.length == 0) {
    //   this.toaster.openWarningSnackBar('لا يوجد اصناف للحفظ')
    //   return;
    // }

    // if (this.masterForm.valid && this.saveButtonClickedFlag) {
    //   this.loading = true;
    //   this.rifflesService.addRiffle(obj).subscribe(
    //     (data: HttpReponseModel) => {
    //       this.loading = false;
    //       if (data.isSuccess) {
    //         this.rifflesService.bSubject.next(false);
    //         this.dialogRef.close();
    //         this.toaster.openSuccessSnackBar(data.message);
    //       }
    //       else if (data.isExists) {
    //         this.toaster.openWarningSnackBar(data.message);
    //       }
    //     },
    //     (error: any) => {
    //       this.loading = false;
    //       console.log(error)
    //       if (error.data)
    //         this.toaster.openWarningSnackBar(error.message);
    //       else
    //         this.toaster.openWarningSnackBar(error);
    //     }
    //   );
    // }

  }

  restrictZero(event: any) {
    if ((event.target.value.length === 1 && event.key === '0' && event.target.value.startsWith("0")) || event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
