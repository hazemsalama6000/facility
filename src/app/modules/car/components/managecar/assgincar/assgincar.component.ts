import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TechnicianService } from 'src/app/core-module/LookupsServices/technician.service';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { AssigntechnicianComponent } from 'src/app/modules/declarations/components/pathroute/assigntechnician/assigntechnician.component';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { Icar } from '../../../models/ICar.interface';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-assgincar',
  templateUrl: './assgincar.component.html',
  styleUrls: ['./assgincar.component.scss']
})
export class AssgincarComponent {
  loading: boolean = false;
  saveButtonClickedFlag = false;
  files: string[] = [];
  userData: IUserData;
  dropdownTechnicianData: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  carAssignForm: FormGroup = this.fb.group({
    driverOrTechId: [null],
    carId: [0],
    notes: [''],
    file: ['']
  });

  constructor(
    private carService: CarService,
    private technicianService: TechnicianService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { carModel: Icar, isTechnician: boolean },
    public dialogRef: MatDialogRef<AssigntechnicianComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);
    this.carAssignForm.patchValue({
      carId: this.data.carModel.id,
      driverId: this.data.carModel.driverId,
      technicianId: this.data.carModel.technicianId
    });

    this.getTechnicianOrDriver();
  }


  addAssignToCar() {

    if (this.carAssignForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;
      if (this.data.isTechnician) {
        this.carService.AssignCarToTechincian(this.createFormData()).subscribe(
          (data: HttpReponseModel) => {
            if (data.isSuccess) {

              this.dialogRef.close();
              this.carService.refreshHistoryData();
              this.toaster.openSuccessSnackBar(data.message);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            } this.loading = false;
          },
          (error: any) => {
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            this.loading = false;
          });
      } else {
        this.carService.AssignCarToDriver(this.createFormData()).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.dialogRef.close();
              this.carService.refreshHistoryData();
              this.toaster.openSuccessSnackBar(data.message);
            }
            else if (data.isExists) {
              this.toaster.openWarningSnackBar(data.message);
            }
          },
          (error: any) => {
            this.loading = false;
            this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
          });
      }
    }

  }

  getTechnicianOrDriver() {
    if (this.data.isTechnician) {
      this.technicianService.getLookUpTechnician(this.userData.branchId).subscribe(
        (res: LookUpModel[]) => this.dropdownTechnicianData = res,
        (err) => console.log(err),
        () => { });
    } else {
      this.carService.getLookUpDriver(this.userData.companyId).subscribe(
        (res: LookUpModel[]) => this.dropdownTechnicianData = res,
        (err) => console.log(err),
        () => { });
    }

  }

  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  createFormData() {
    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++)
      formData.append("File", this.files[i]);
    if (this.files.length == 0)
      formData.append("File",'k');


    if (this.data.isTechnician)
      formData.append("technicianId", this.carAssignForm.get('driverOrTechId')?.value);
    else
      formData.append("DriverId", this.carAssignForm.get('driverOrTechId')?.value);

    formData.append("carId", this.carAssignForm.get('carId')?.value);
    formData.append("Notes", this.carAssignForm.get('notes')?.value);

    return formData;
  }



  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
