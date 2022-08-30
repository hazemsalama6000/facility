import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegionService } from 'src/app/core-module/LookupsServices/region.service';
import { StateService } from 'src/app/core-module/LookupsServices/state.service';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IPathRoute } from '../../../models/IPathRoute.interface';
import { PathrouteService } from '../../../services/pathroute.service';

@Component({
  selector: 'app-addpathroute',
  templateUrl: './addpathroute.component.html',
  styleUrls: ['./addpathroute.component.scss']
})
export class AddpathrouteComponent {

  saveButtonClickedFlag = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];
  dropdownStateData: LookUpModel[] = [];
  dropdownRegionData: LookUpModel[] = [];
  dropdownTechnicianData: LookUpModel[] = [];


  pathRouteForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    region_Id: [null, Validators.compose([Validators.required])],
    state_Id: [null, Validators.compose([Validators.required])],
    technician_Id: [null, Validators.compose([Validators.required])],
    companyBranch_Id: [0],
    isActive: [true]
  });

  constructor(
    private pathrouteService: PathrouteService,
    private technicianService:TechnicianService,
    private stateService: StateService,
    private regionService: RegionService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { pathRoute: IPathRoute },
    public dialogRef: MatDialogRef<AddpathrouteComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    this.getstate();
    this.getTechnician();
  }

  addPathRoute() {
    
    if (this.pathRouteForm.valid && this.saveButtonClickedFlag) {
      this.pathRouteForm.patchValue({ companyBranch_Id: this.userData.branchId });
      this.pathrouteService.addPathRoute(this.pathRouteForm.value).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.pathrouteService.bSubject.next(false);
            this.dialogRef.close();
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => {
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      );
    }

  }

  getstate() {
    this.stateService.getLookupStateData().subscribe(
      (res: LookUpModel[]) => this.dropdownStateData = res,
      (err) => console.log(err),
      () => { });
  }

  getRegion(model: LookUpModel) {
    console.log(model)
    this.regionService.getLookupStateData(model.Id).subscribe(
      (res: LookUpModel[]) => this.dropdownRegionData = res,
      (err) => console.log(err),
      () => { });
  }

  getTechnician() {
    this.technicianService.getLookUpTechnician(this.userData.branchId).subscribe(
      (res: LookUpModel[]) => this.dropdownTechnicianData = res,
      (err) => console.log(err),
      () => { });
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
