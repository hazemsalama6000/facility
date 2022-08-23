import { DatePipe } from '@angular/common';
import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { AreaService } from 'src/app/core-module/LookupsServices/area.service';
import { BlockService } from 'src/app/core-module/LookupsServices/block.service';
import { BranchService } from 'src/app/core-module/LookupsServices/branch.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { CutomerService } from 'src/app/modules/customers/services/customer.service';
import { UserLocationComponent } from '../customer-update-manage/update-datatable/user-locations/user-location.component';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IComplain, IComplainList } from '../../models/IComplain.interface';
import { IComplainSearch } from '../../models/IComplainSearch.interface';
import { IUpdateComplain } from '../../models/IUpdateComplain.interface';
import { ComplainService } from '../../services/complain.service';
import { ViewimagesComponent } from './viewimages/viewimages.component';

@Component({
  selector: 'app-complain-list',
  templateUrl: './complain-list.component.html',
  styleUrls: ['./complain-list.component.scss']
})
export class ComplainListComponent implements OnInit {
  btnIsRevise: boolean = false;
  showBtnIsRevise: boolean = true;

  startDate: string;
  endDate: string;

  branchDropdown: LookUpModel[];
  areaDropdown: LookUpModel[];
  blockDropdown: LookUpModel[];
  customerDropdown: LookUpModel[];
  collectorDropdown: LookUpModel[];

  complainData: IComplainList[] = [];
  searchObject: IComplainSearch;
  totalRecords: number;

  userData: IUserData;
  loading: boolean = true;
  private unsubscribe: Subscription[] = [];

  constructor(
    private complainService: ComplainService,
    private branchService: BranchService,
    private areaService: AreaService,
    private blockService: BlockService,
    private CutomerService: CutomerService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toaster: toasterService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
  ) {

    this.searchObject = {
      PageNumber: 1,
      PageSize: 10,
    };

  }

  ngOnInit() {
    const data = this.authService.userData.subscribe(res => {
      this.userData = res;
      this.fillDropdowns();
      this.getComplainData();
    });
    this.unsubscribe.push(data);
  }

  // Change pagination page
  changePage(e: any) {
    this.searchObject.PageSize = e.rows;
    this.searchObject.PageNumber = e.page + 1;
    this.getComplainData();
  }

  //this function to create search object and reload data in table
  myfilter(columnname: string) {

    switch (columnname) {
      case "branch":
        this.areaService.getLookupAreaData(this.searchObject.BranchId ?? 0).subscribe(
          (data: LookUpModel[]) => { this.areaDropdown = data; });
        this.employeeService.getLookupEmployeeDataByParam({ branchId: this.searchObject.BranchId ?? 0 })
          .subscribe((res: LookUpModel[]) => this.collectorDropdown = res);
        break;
      case "area":
        this.blockService.getLookupBlockData(this.searchObject.AreaId ?? 0).subscribe(
          (data: LookUpModel[]) => { this.blockDropdown = data; });
        this.CutomerService.getLookupCustomerDataByParam({ AreaId: this.searchObject.AreaId ?? 0 })
          .subscribe((data: LookUpModel[]) => { this.customerDropdown = data; });
        break;
      case "block":
        this.CutomerService.getLookupCustomerDataByParam({ AreaId: this.searchObject.AreaId ?? 0, Block: this.searchObject.BlockId ?? 0 })
          .subscribe((data: LookUpModel[]) => { this.customerDropdown = data; });
        break;
      case "startDate":
        this.searchObject.StartDate = this.datePipe.transform(new Date(this.startDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
        break;
      case "endDate":
        this.searchObject.EndDate = this.datePipe.transform(new Date(this.endDate ?? ''), 'yyyy-MM-dd') + "T00:00:00" ?? '';
        break;
      case "CustomerCode":
        this.startDate = '';
        this.endDate = '';
        this.searchObject = {
          PageNumber: this.searchObject.PageNumber,
          PageSize: this.searchObject.PageSize,
          CustomerCode: this.searchObject.CustomerCode
        }
        break;
      default:
        break;
    }

    if (columnname != 'CustomerCode') delete this.searchObject.CustomerCode

    this.getComplainData();
  }

  //this function to fill dropdowns data
  fillDropdowns() {
    this.branchService.getLookupBranchData(this.userData.companyId).subscribe((data: LookUpModel[]) => { this.branchDropdown = data; });
  }

  //this function to get data from employee 
  getComplainData() {
    this.loading = true;
    this.complainService.getComplainsData(this.searchObject).subscribe(
      (res: IComplain) => {
        this.complainData = res.data;
        this.totalRecords = res.totalRecords;
      },
      (err: any) => { console.log(err); this.loading = false },
      () => { this.loading = false });
  }

  setAllIsRevise(type: string) {
    if (type == 'revise') {
      for (let index = 0; index < this.complainData.length; index++) {
        this.complainData[index].isRevised = this.btnIsRevise;
      }
    }
  }

  postAllDataToChecked() {
    let complain: IUpdateComplain[] = [];
    this.complainData.map(x => complain.push({ id: x.id, isRevised: x.isRevised }));
    this.postRevise(complain);
  }

  ActiveRevise(complain: IComplainList) {
    let complains: IUpdateComplain[] = [{ id: complain.id, isRevised: complain.isRevised }];
    this.postRevise(complains)
  }

  postRevise(complain: IUpdateComplain[]) {
    this.confirmationDialogService.confirm('تأكيد المراجعة', `هل تريد تأكيد المراجعة  ? `)
      .then((confirmed) => {
        if (confirmed) {
          this.complainService.PostIsrevise(complain).
            subscribe(
              (data: HttpReponseModel) => {
                if (data.isSuccess) {
                  this.toaster.openSuccessSnackBar(data.message);
                }
                else if (data.isExists)
                  this.toaster.openWarningSnackBar(data.message);
              },
              (error: any) => {
                console.log(error);
                this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
              }
            )
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  currentLocation(x: number, y: number) {

    const dialogPosition: DialogPosition = {
      top: '0px',
      right: '0px'
    };

    const dialogRef = this.dialog.open(UserLocationComponent,
      {
        /*maxWidth: '50vw',
        maxHeight: '100vh',*/
        maxHeight: '100vh',
        height: '100%',

        //panelClass: 'full-screen-modal',*/
        position: dialogPosition,
        data: { x: x, y: y }
      });

    dialogRef.afterClosed().subscribe((result: any) => { console.log(`Dialog result: ${result}`); });
  }

  exportExcel() {
    let selectedColumns: string[] = [
      'id',
      'date',
      'collectorName',
      'customerName',
      'branchName',
      'areaName',
      'blockName',
      'issueName',
      'x',
      'y',
      'details',
      'isRevised',
      'complaintTypeName'];
    let complainFiltered: any[] = [];
    this.complainData.map((x: any) => {
      let obj: any = {};

      for (let index = 0; index < selectedColumns.length; index++) {
        if (selectedColumns[index].includes('Date')) {
          obj[selectedColumns[index]] = this.datePipe.transform(x[selectedColumns[index]], 'dd/MM/yyyy');
        } else {
          obj[selectedColumns[index]] = x[selectedColumns[index]];
        }
      }

      complainFiltered.push(obj)
    })

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(complainFiltered);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "complain");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + this.datePipe.transform(new Date(), 'MM/dd/yyyy') + EXCEL_EXTENSION);
  }
  // End Export Functions

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe);
  }

  openDialog(complain: IComplainList) {
    // const dialogPosition: DialogPosition = {
    // 	top: '0px',
    // 	right: '0px'
    // };

    const dialogRef = this.dialog.open(ViewimagesComponent,
      {
        /*maxWidth: '50vw',
        maxHeight: '100vh',*/
        maxHeight: '100vh',
        minHeight: '50%',
        width: '50%',

        //panelClass: 'full-screen-modal',*/
        // position: dialogPosition,
        data: { complain: complain }
      });
  }

}
