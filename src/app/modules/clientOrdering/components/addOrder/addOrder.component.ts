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
import { IConvertedUnits } from 'src/app/modules/items/models/itemsCategory/IItemProfile.interface';
import { IAddOrder, IAddOrderItems } from '../../models/IAddOrder.interface';
import { OrderingService } from '../../services/ordering.service';

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


  columnsToDisplay = ['n', 'branchName', 'notes', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IOrderOperation | null;
  @ViewChild(MatTable) table: MatTable<IOrderOperation>;
  loading: boolean = false;
  itemLoader: boolean = false;
  dataSource: IOrderOperation[] = [];
  item: IItemsForOrder = {} as IItemsForOrder;
  userData: IUserData;
  dropdownClient: LookUpModel[] = [];
  dropdownClientBranch: LookUpModel[] = [];
  noQuantity: boolean = false;
  searchItem: string;
  saveButtonClickedFlag: boolean = false;
  isReadOnly: boolean = false;
  private unsubscribe: Subscription[] = [];

  masterForm: FormGroup = this.fb.group({
    Id: [0],
    TotalPrice: [null],
    OrderEmployee_Id: [null, Validators.compose([Validators.required])],
    ClientBranch_Id: [null, Validators.compose([Validators.required])],
    Client_Id: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private fb: FormBuilder,
    private clientBranch: ClientBranchService,
    private client: ClientService,
    private itemService: ItemService,
    private orderService: OrderingService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<AddOrderComponent>,
    private toaster: toasterService,
    // @Inject(MAT_DIALOG_DATA) public data: { model: IRiffles }
  ) {
    let subuser = this.auth.userData.subscribe((data: IUserData) => {
      this.userData = data;
      this.masterForm.get('OrderEmployee_Id')?.setValue(this.userData.employeeId);
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
    if (this.masterForm.valid) {
      this.isReadOnly = true;
      this.autoCompleteItems = []
      if (text.length > 2) {
        this.itemLoader = true
        this.itemService.getLookUpItemsByCode(this.userData.companyId, text).subscribe(res => {
          if (res)
            this.autoCompleteItems = res
          this.itemLoader = false;
        });

      }
    } else
      this.toaster.openWarningSnackBar('برجاء استكمال البيانات الاساسية أولاً')
  }

  displayinputAutoComplete = (item?: LookUpModel): string => item ? item.Name : '';
  onSelectedAutoComplete(x: MatAutocompleteSelectedEvent) {
    if (x.option.value.Id) {
      this.itemLoader = true;
      this.itemService.getItemProfileForOrder(x.option.value.Id, this.userData.companyId).subscribe(res => {
        if (res) {
          res.convertedUnit = res.convertedUnits.find(x => x.isBaseUnit) ?? {} as IConvertedUnits;
          res.total = 0;
          this.item = res;
          this.itemLoader = false;
        }
        this.itemLoader = false;
      }, (err) => { this.toaster.openWarningSnackBar(err); this.itemLoader = false; })
    }
  }

  AddItem() {
    let branches: LookUpModel[] = this.masterForm.get('ClientBranch_Id')?.value as LookUpModel[];
    if (branches.length > 0 && this.item) {

      branches.map(branch => {
        let dataSourceOrder: IOrderOperation | undefined = this.dataSource.find(x => x.branchId == branch.Id);
        if (dataSourceOrder)
          dataSourceOrder.items.findIndex(x => x.id == this.item.id) == -1 ? dataSourceOrder?.items.push({ ...this.item }) : null;
        else {
          let order: IOrderOperation = {} as IOrderOperation;
          order.branchId = branch.Id;
          order.branchName = branch.Name;
          order.total = 0;
          order.items = [];
          order.items.push({ ...this.item });
          this.dataSource.push(order);
        }
      });

    }
    this.table.renderRows();
  }

  deleteOrder(elementIndex: number) {
    this.dataSource.splice(elementIndex, 1);
    this.table.renderRows();
  }

  deleteItem(elementIndex: number, itemIndex: number) {
    this.dataSource[elementIndex].items.splice(itemIndex, 1);
    this.table.renderRows();
  }

  inputQuantity(element: IItemsForOrder, elementIndex: number, itemIndex: number) {
    if (!isNaN(element.quantity) && !isNaN(element.price)) {
      this.dataSource[elementIndex].items[itemIndex].total = (element.quantity * element.convertedUnit.factor) * element.price;
      // this.dataSource[elementIndex].total = this.dataSource[elementIndex].items.reduce((sum, current) => sum + current.total, 0);
      this.table.renderRows();
    }
  }


  addOrder() {

    let obj = this.createObject();

    console.log(JSON.stringify(obj))
    console.log(obj)

    if (obj.length == 0) {
      this.toaster.openWarningSnackBar('لا يوجد بيانات للحفظ')
      return;
    }

    if (this.masterForm.valid && this.saveButtonClickedFlag && !this.noQuantity) {
      this.loading = true;
      this.orderService.addOrder(obj).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
          if (data.isSuccess) {
            this.orderService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error)
          if (error.data)
            this.toaster.openWarningSnackBar(error.message);
          else
            this.toaster.openWarningSnackBar(error);
        }
      );
    }

  }

  createObject(): IAddOrder[] {
    console.log(this.dataSource)
    let orders: IAddOrder[] = [];

    this.dataSource.map((ord, ordIndex) => {
      let order: IAddOrder = {} as IAddOrder;
      order.id = 0;
      order.clientBranch_Id = ord.branchId;
      order.orderEmployee_Id = this.userData.employeeId;
      order.totalPrice = ord.total;
      order.notes = order.notes;

      order.orderItems = [];
      ord.items.map(item => {

        item.noQuantity = item.quantity == null || item.quantity == undefined || item.quantity == 0 ? true : false;
        this.noQuantity = this.noQuantity ? true : item.noQuantity;

        if (item.noQuantity) {
          this.toaster.openWarningSnackBar(`الكميات غير صحيحة فى الطلب رقم ${ordIndex+1} `);
        }
        order.orderItems.push({
          id: 0,
          order_Id: 0,
          notes: item.notes ?? '',
          quantity: item.quantity,
          isRefuse: false,
          isRefuseNotes: '',
          canChangeQuantity: item.CanChangeQuantity ?? false,
          canRefuse: item.CanRefuse ?? false,
          canScaduled: item.CanScaduled ?? false,
          unitConversion_Id: item.convertedUnit.unitConversionId
        });
      });
      console.log(this.noQuantity)

      orders.push(order);
    });

    return orders;
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
