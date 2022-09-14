import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { IPathRoute } from '../../../models/IPathRoute.interface';
import { PathrouteService } from '../../../services/pathroute.service';

@Component({
  selector: 'app-assigntechnician',
  templateUrl: './assigntechnician.component.html',
  styleUrls: ['./assigntechnician.component.scss']
})
export class AssigntechnicianComponent {
  loading: boolean = false;
  saveButtonClickedFlag = false;
  userData: IUserData;
  dropdownTechnicianData: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  pathRouteForm: FormGroup = this.fb.group({
    technician_Id: [null, Validators.compose([Validators.required])],
    pathRouteId: [0],
  });

  constructor(
    private pathrouteService: PathrouteService,
    private technicianService: TechnicianService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { pathRoute: IPathRoute },
    public dialogRef: MatDialogRef<AssigntechnicianComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    this.getTechnician();
  }


  addPathRoute() {

    if (this.pathRouteForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      this.pathRouteForm.patchValue({ pathRouteId: this.data.pathRoute.id });
      this.pathrouteService.AssignPathRouteToTechnician(this.pathRouteForm.get('pathRouteId')?.value, this.pathRouteForm.get('technician_Id')?.value).subscribe(
        (data: HttpReponseModel) => {
          this.loading = false;
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
          this.loading = false;
          this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
        }
      );
    }

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
