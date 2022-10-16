import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { ISearchVendor } from '../../models/ISearchVendor.interface';
import { IVendor } from '../../models/IVendor.interface';
import { VendorService } from '../../services/vendor.service';
import { VendoractivityService } from '../../services/vendoractivity.service';
import { VendorclassificationService } from '../../services/vendorclassification.service';
import { VendormiancompanyService } from '../../services/vendormiancompany.service';
import { UpsertvendorComponent } from './upsertvendor/upsertvendor.component';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'code', 'mainCompany', 'email', 'site', 'mobile', 'isWithHoldTaxActive', 'withHoldTax', 'isVatTaxActive', 'vatTax', 'isActive', 'state'];
  dataSource: any;
  taxOffice: LookUpModel[] = [];
  classification: LookUpModel[] = [];
  activity: LookUpModel[] = [];
  mainCompany: LookUpModel[] = [];
  vendors: LookUpModel[] = [];
  branchs: LookUpModel[] = [];
  searchModel: ISearchVendor = {
    company_Id: 0,
    // branch_Id: [],
    activity_Ids: null,
    classification_Ids: null,
    mainCompany_Ids: null,
    taxOffice_Ids: null,
    vendor_Ids: null
  }
  userdata: IUserData
  private unsubscribe: Subscription[] = [];

  constructor(
    private vendorervice: VendorService,
    private activityService: VendoractivityService,
    private classificationService: VendorclassificationService,
    private mainCompanyService: VendormiancompanyService,
    private auth: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    const udata = this.auth.userData.subscribe(res => {
      this.userdata = res
      this.searchModel.company_Id = res.companyId
      const datajob = this.vendorervice.bSubject.subscribe(data => { this.getallData(); this.filldropdown(); });
      this.unsubscribe.push(datajob);
    });
    this.unsubscribe.push(udata);
  }

  ngOnInit() {
   
  }

  filldropdown() {
    this.mainCompanyService.getLookUpMainCompany(this.userdata.companyId).subscribe(res => this.mainCompany = res);
    this.activityService.getLookUpActivity(this.userdata.companyId).subscribe(res => this.activity = res);
    this.classificationService.getLookUpClassification(this.userdata.companyId).subscribe(res => this.classification = res);
    this.vendorervice.getLookUpTaxOffice().subscribe(res => this.taxOffice = res);
    this.vendorervice.getLookUpBranch(this.userdata.companyId).subscribe(res => this.branchs = res);
    this.vendorervice.getLookUpVendor(this.userdata.companyId).subscribe(res => this.vendors = res);
  }

  onSelectVendor(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.vendor_Ids = [];
      items.map(x => this.searchModel.vendor_Ids?.push(x.Id));
    } else
      this.searchModel.vendor_Ids = null;
    this.getallData();
  }

  onSelectBranch(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.branch_Ids = [];
      items.map(x => this.searchModel.branch_Ids?.push(x.Id));
    } else
      this.searchModel.branch_Ids = null;
    this.getallData();
  }

  onSelectClassification(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.classification_Ids = [];
      items.map(x => this.searchModel.classification_Ids?.push(x.Id));
    } else
      this.searchModel.classification_Ids = null;
    this.getallData();
  }

  onSelectActivity(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.activity_Ids = [];
      items.map(x => this.searchModel.activity_Ids?.push(x.Id));
    } else
      this.searchModel.activity_Ids = null;
    this.getallData();
  }

  onSelectMainCompany(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.mainCompany_Ids = [];
      items.map(x => this.searchModel.mainCompany_Ids?.push(x.Id));
    } else
      this.searchModel.mainCompany_Ids = null;
    this.getallData();
  }

  onSelectTaxOffice(items: LookUpModel[]) {
    if (items.length > 0) {
      this.searchModel.taxOffice_Ids = [];
      items.map(x => this.searchModel.taxOffice_Ids?.push(x.Id));
    } else
      this.searchModel.taxOffice_Ids = null;
    this.getallData();
  }



  openDialog(model?: IVendor) {
    this.dialog.open(UpsertvendorComponent,
      {
        maxHeight: '100vh',
        height: '100%',
        width: '80%',
        position: {
          right: '0'
        },
        data: { model: model }
      });
  }

  deleteVendorClassification(model: IVendor) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${model.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.vendorervice.deleteVendor(model.id).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.getallData();
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  // getting data and initialize data Source and Paginator
  getallData() {
    this.vendorervice.getVendor(this.searchModel)
      .subscribe((data: IVendor[]) => {
        this.dataSource = new MatTableDataSource<IVendor>(data);
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
