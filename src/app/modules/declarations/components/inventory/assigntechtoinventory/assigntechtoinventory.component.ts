import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IInventory } from '../../../models/IInventory.interface';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-assigntechtoinventory',
  templateUrl: './assigntechtoinventory.component.html',
  styleUrls: ['./assigntechtoinventory.component.scss']
})
export class AssigntechtoinventoryComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['employeeName', 'startDate','endData','deActiveBy', 'state'];
  dataSource: any;

  saveButtonClickedFlag = false;
  userData: IUserData;
  dropdownTechnicianData: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  stockAssignForm: FormGroup = this.fb.group({
    StockId: [0],
    EmployeeId: [null, [Validators.required]],
  });

  constructor(
    private inventoryService: InventoryService,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { model: IInventory },
    public dialogRef: MatDialogRef<AssigntechtoinventoryComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    this.getEmployee();
    this.getallData()
  }

  addAssignToStock() {
    if (this.stockAssignForm.valid && this.saveButtonClickedFlag) {
      this.stockAssignForm.patchValue({ StockId: this.data.model.id });
      this.inventoryService.AssignTechnicianToInventory(this.stockAssignForm.get('StockId')?.value, this.stockAssignForm.get('EmployeeId')?.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.inventoryService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        });
    }
  }

  getEmployee() {
    this.employeeService.getLookupEmployeeData(this.userData.companyId,this.userData.branchId).subscribe(
      (res: LookUpModel[]) => this.dropdownTechnicianData = res,
      (err) => console.log(err),
      () => { });
  }

  // getting data and initialize data Source and Paginator
  getallData() {
    this.inventoryService.GetInventoryTechnicianLogs(this.data.model.id).subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;

    });
  }

  //filter from search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
