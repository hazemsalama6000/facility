import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { IJob, IJobSub } from 'src/app/modules/share/models/IJob.interface';
import { ISection } from 'src/app/modules/share/models/ISection.interface';
import { DepartmentService } from 'src/app/modules/share/Services/department_section/department.service';
import { SectionService } from 'src/app/modules/share/Services/department_section/section.service';
import { JobService } from 'src/app/modules/share/Services/job.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IBranch } from '../../hr/models/IBranch';
import { BranchService } from '../../hr/services/branch.service';
import { IEmployeeList } from '../models/IEmployeeList.interface';
import * as FileSaver from 'file-saver';
import { IUserData } from '../../auth/models/IUserData.interface';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EmployeeService } from '../../employees/services/employee.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class Employee_listComponent implements OnInit, OnDestroy {

  employeeDropdown: LookUpModel[];
  branchDropdown: IBranch[];
  departmentDropdown: LookUpModel[];
  sectionDropdown: ISection[];
  jobDropdown: IJobSub[];

  searchObject: IEmployeeSearch;
  totalRecords: number;

  employees: IEmployeeList[];
  userData: IUserData;

  selectedColumns: any[] = [
    { propName: 'name', translateKey: "NAME" },
    { propName: 'branch', translateKey: 'BRANCHNAME' },
    { propName: 'department', translateKey: 'DEPARTMENT' },
    { propName: 'section', translateKey: 'SECTION' },
    { propName: 'job', translateKey: 'JOB' },
    { propName: 'mobile', translateKey: 'MOBILE' }];

  columns: any[] = [
    { propName: 'hireDate', translateKey: "HIREDATE" },
    { propName: 'graduateDate', translateKey: "GRADUATIONDATE" },
    { propName: 'qualification', translateKey: "QUALIFICATION" },
    { propName: 'university', translateKey: "UNIVERSITY" },
    { propName: 'nId', translateKey: "NID" },
    { propName: 'birthDate', translateKey: "BITHDATE" },
    { propName: 'address', translateKey: "ADDRESS" },
    { propName: 'state', translateKey: "STATE" },
    { propName: 'region', translateKey: "REGION" },
    { propName: 'martialStatus', translateKey: "MARTIALSTATUS" },
    { propName: 'militery_Status', translateKey: "MILITERYSTATUS" }];

  loading: boolean = true;
  private unsubscribe: Subscription[] = [];

  constructor(
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private sectionService: SectionService,
    private jobService: JobService,
    private datePipe: DatePipe
  ) {

    this.searchObject = {
      branchesIds: [],
      departmentsIds: [],
      employeesIds: [],
      jobsIds: [],
      sectionsIds: [],
      pageSize: 5,
      pageNumber: 1
    };

  }

  ngOnInit() {
    const data = this.authService.userData.subscribe(res => {
      this.userData = res;
      this.fillDropdowns();
      this.getEmployeeData();
    });
    this.unsubscribe.push(data);
  }

  // Change pagination page
  changePage(e: any) {
    this.searchObject.pageSize = e.rows;
    this.searchObject.pageNumber = e.page + 1;
    this.getEmployeeData();
  }

  //this function to create search object and reload data in table
  myfilter(ids: any, columnname: string) {
    switch (columnname) {
      case "employee":
        this.searchObject.employeesIds = ids.map((a: any) => a.Id);
        break;
      case "branch":
        ids != null ? this.searchObject.branchesIds = [ids.id] : this.searchObject.branchesIds = [];
        break;
      case "department":
        if (ids != null) {
          this.searchObject.departmentsIds = [ids.Id];
          this.sectionService.getLookupData(ids.id).subscribe((res: ISection[]) =>
            this.sectionDropdown = res
          );
        } else this.searchObject.departmentsIds = [];
        break;
      case "section":
        if (ids != null) {
          this.searchObject.sectionsIds = [ids.id];
          this.jobService.getLookUpData(this.searchObject.sectionsIds[0]).subscribe((res: IJob) =>
            this.jobDropdown = res.jobs.filter(x => x.isSelected == true)
          );
        } else this.searchObject.sectionsIds = [];
        break;
      case "job":
        this.searchObject.jobsIds = ids.map((a: any) => a.Id);
        break;
      default:
        break;
    }

    this.getEmployeeData();
  }

  //this function to fill dropdowns data
  fillDropdowns() {

    this.employeeService.getLookupEmployeeData(this.userData.companyId).subscribe((data: LookUpModel[]) => {
      this.employeeDropdown = data;
    });

    this.branchService.getBranchData(this.userData.companyId).subscribe((data: IBranch[]) => this.branchDropdown = data);

    this.departmentService.getLookupData(this.userData.companyId).subscribe((res: LookUpModel[]) => this.departmentDropdown = res);

  }

  //this function to get data from employee 
  getEmployeeData() {
    this.loading = true;
    this.employeeService.getEmployeesData(this.searchObject).subscribe(
      res => {
        this.employees = res.employeeRecords;
        this.totalRecords = res.pageSize;
      },
      err => { console.log(err); this.loading = false },
      () => { this.loading = false });
  }

  // start Export Functions
  exportPdf() {
    // import("jspdf").then(jsPDF => {
    //     import("jspdf-autotable").then(x => {
    //         const doc = new jsPDF.default(0,0);
    //         doc.autoTable(this.exportColumns, this.products);
    //         doc.save('products.pdf');
    //     })
    // })
    // const doc = new jsPDF('p','pt');
    // doc['autoTable']([], []);
    // doc.save("products.pdf");
    // this.generatePdf();
  }


  // generatePdf() {
  //   let header: string[] = [];
  //   let tableData: any = [];
  //   this.selectedColumns.map((s) => header.push(s.translateKey));
  //   this.employees.map((obj: any) => {
  //     let o: string[] = [];
  //     for (let index = 0; index < this.selectedColumns.length; index++) {
  //       let prop = obj[this.selectedColumns[index].propName]
  //       o.push(`${prop ?? ''}`);
  //     }
  //     tableData.push(o);
  //   })

  //   var pdf = new jsPDF();
  //   // pdf.addFileToVFS('Cairo-Black-normal.ttf', font);
  //   pdf.addFont('Cairo-Black-normal.ttf', 'Cairo-Black', 'normal');
  //   pdf.setFont('Cairo-Black')
  //   pdf.setFontSize(12);
  //   pdf.text('بيانات الموظفين', 100, 8);
  //   pdf.setFontSize(12);
  //   pdf.setTextColor(99);

  //   autoTable(pdf, {
  //     columns: [{ title: "الا", dataKey: "name" }],
  //     body: [{ name: "jjhj" }, { name: "jjhj" }, { name: "jjhj" }, { name: "jjhj" }],
  //     didDrawPage: (dataArg) => {
  //       pdf.text('Sales', dataArg.settings.margin.left, 10);
  //     }
  //   });
  //   // Open PDF document in browser's new tab
  //   pdf.output('dataurlnewwindow')
  //   // Download PDF doc  
  //   pdf.save('table.pdf');
  // }

  exportExcel() {
    let employeeFiltered: any[] = [];
    this.employees.map((x: any) => {
      let obj: any = {};
      for (let index = 0; index < this.selectedColumns.length; index++) {
        if (this.selectedColumns[index].propName.includes('Date')) {
          obj[this.selectedColumns[index].propName] = this.datePipe.transform(x[this.selectedColumns[index].propName], 'dd/MM/yyyy');
        } else {
          obj[this.selectedColumns[index].propName] = x[this.selectedColumns[index].propName];
        }
      }

      employeeFiltered.push(obj)
    })

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(employeeFiltered);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Employees");
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

}

export interface IEmployeeSearch {
  branchesIds: number[];
  employeesIds: number[];
  departmentsIds: number[];
  sectionsIds: number[];
  jobsIds: number[];
  pageNumber: number;
  pageSize: number;
}





