import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IReading, IReadingList } from '../../models/IReading.interface';
import { IReadingSearch } from '../../models/IReadingSearch.interface';
import { IUpdateReading } from '../../models/IUpdateReading.interface';
import { ReadingService } from '../../services/reading.service';
import { UserLocationComponent } from '../customer-update-manage/update-datatable/user-locations/user-location.component';

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit {
  btnIsPost: boolean = false;
  showBtnIsPost: boolean = true;
  btnIsRevise: boolean = false;
  showBtnIsRevise: boolean = true;

  url: string = localStorage.getItem("companyLink") ?? ""

  startDate: string;
  endDate: string;

  branchDropdown: LookUpModel[];
  areaDropdown: LookUpModel[];
  blockDropdown: LookUpModel[];
  customerDropdown: LookUpModel[];
  collectorDropdown: LookUpModel[];

  readingData: IReadingList[] = [];
  searchObject: IReadingSearch;
  totalRecords: number;

  userData: IUserData;
  loading: boolean = true;
  private unsubscribe: Subscription[] = [];

  constructor(
    private readingService: ReadingService,
    private branchService: BranchService,
    private areaService: AreaService,
    private blockService: BlockService,
    private CutomerService: CutomerService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toaster: toasterService,
    private datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
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
      this.getReadingData();
    });
    this.unsubscribe.push(data);
  }

  // Change pagination page
  changePage(e: any) {
    this.searchObject.PageSize = e.rows;
    this.searchObject.PageNumber = e.page + 1;
    this.getReadingData();
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
   this.getReadingData();
  }

  //this function to fill dropdowns data
  fillDropdowns() {
    this.branchService.getLookupBranchData(this.userData.companyId).subscribe((data: LookUpModel[]) => { this.branchDropdown = data; });
  }

  //this function to get data from employee 
  getReadingData() {
    this.loading = true;
    this.readingService.getReadingsData(this.searchObject).subscribe(
      (res: IReading) => {
        let data: IReadingList[] = res.data ?? [];
        data.map(x => {
          x.lastPosted = x.isPosted;
          x.lastRevised = x.isRevised
        });
        this.readingData = res.data;
        this.totalRecords = res.totalRecords;
      },
      (err: any) => { console.log(err); this.loading = false },
      () => { this.loading = false });
  }

  setAllIsPostOrIsRevise(type: string) {
    if (type == 'revise') {
      for (let index = 0; index < this.readingData.length; index++) {
        if (!this.readingData[index].lastPosted) {
          this.readingData[index].isRevised = this.btnIsRevise;
        }
      }
    } else if (type == 'post') {
      for (let index = 0; index < this.readingData.length; index++) {
        if (!this.readingData[index].lastPosted) {
          this.readingData[index].isPosted = this.btnIsPost;
          this.readingData[index].isRevised = this.btnIsPost;
        }
      }
    }


  }

  postAllDataToChecked() {
    let reading: IUpdateReading[] = [];
    this.readingData.filter(x => !x.lastPosted).map(o => reading.push({ id: o.id, isRevised: o.isRevised, isPosted: o.isPosted }));
    this.postReviseOrPost(reading);
  }

  ActivePostOrRevise(read: IReadingList) {
    if (read.isPosted == read.lastPosted && read.isRevised == read.lastRevised) return;

    let reading: IUpdateReading[] = [{ id: read.id, isRevised: read.isRevised, isPosted: read.isPosted }];
    this.postReviseOrPost(reading)
  }

  postReviseOrPost(reading: IUpdateReading[]) {

    this.confirmationDialogService.confirm('تأكيد المراجعة أو الارسال', `هل تريد تأكيد المراجعة أو الارسال ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.readingService.PostIsreviseOrIsPost(reading).subscribe(
            (data: HttpReponseModel) => {
              if (data.isSuccess) {
                data.data?.map((x: IUpdateReading) => {
                  let indexRead = this.readingData.findIndex(r => r.id == x.id);
                  this.readingData[indexRead].isPosted = x.isPosted;
                  this.readingData[indexRead].lastPosted = x.isPosted;
                  this.readingData[indexRead].isRevised = x.isRevised;
                });
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
      'collectorId',
      'collectorName',
      'customerId',
      'customerName',
      'customerCode',
      'branchName',
      'value',
      'lastReading',
      'x',
      'y',
      'meterStatus',
      'issueName',
      'issueStatus',
      'issueDate',
      'isRevised',
      'isPosted',
      'lastPosted',
      'notes',
    ];
    let readingFiltered: any[] = [];
    this.readingData.map((x: any) => {
      let obj: any = {};

      for (let index = 0; index < selectedColumns.length; index++) {
        if (selectedColumns[index].includes('Date')) {
          obj[selectedColumns[index]] = this.datePipe.transform(x[selectedColumns[index]], 'dd/MM/yyyy');
        } else {
          obj[selectedColumns[index]] = x[selectedColumns[index]];
        }
      }

      readingFiltered.push(obj)
    })


    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(readingFiltered);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reading");
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

  changeIsPost(read: IReadingList, index: number) {
    if (read.isPosted)
      this.readingData[index].isRevised = true;
    else
      this.readingData[index].isRevised = this.readingData[index].lastRevised ?? false;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe);
  }


}
