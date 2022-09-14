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
import { Icar } from '../../../models/ICar.interface';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-upsertcar',
  templateUrl: './upsertcar.component.html',
  styleUrls: ['./upsertcar.component.scss']
})
export class UpsertcarComponent {

  loading: boolean = false;
  saveButtonClickedFlag = false;
  isEdit: boolean = false;
  userData: IUserData;
  private unsubscribe: Subscription[] = [];
  dropdownCarModelData: LookUpModel[] = [];
  dropdownDriverData: LookUpModel[] = [];
  dropdownTechnicianData: LookUpModel[] = [];


  carForm: FormGroup = this.fb.group({
    id: [0],
    carNumber: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    carModel_Id: [null, Validators.compose([Validators.required])],
    driver_Id: [null],
    technician_Id: [null],
    branch_Id: [0]
  });

  constructor(
    private carService: CarService,
    private technicianService: TechnicianService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { carModel: Icar },
    public dialogRef: MatDialogRef<UpsertcarComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);

    if (data.carModel) {
      this.isEdit = true;
      this.carForm.patchValue({
        id: data.carModel.id,
        carNumber: data.carModel.plateCar,
        carModel_Id: data.carModel.model_Id,
        technician_Id: data.carModel.technicianId,
        driver_Id: data.carModel.driverId
      });
    }

    this.fillDropdowns();
  }

  addOrUpdateCar() {

    if (this.carForm.valid && this.saveButtonClickedFlag) {
      this.carForm.patchValue({
        branch_Id: this.userData.branchId,
        technician_Id: this.carForm.get('technician_Id')?.value == null ? 0 : this.carForm.get('technician_Id')?.value,
        driver_Id: this.carForm.get('driver_Id')?.value == null ? 0 : this.carForm.get('driver_Id')?.value
      });
      this.loading = true;

      if (this.isEdit) {
        let model: any = {
          Id: this.carForm.get('id')?.value,
          carModel_Id: this.carForm.get('carModel_Id')?.value,
          carNumber: this.carForm.get('carNumber')?.value
        };
        this.carService.updateCar(model).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.carService.bSubject.next(false);
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
      } else {
        this.carService.addCar(this.carForm.value).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.carService.bSubject.next(false);
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

  }

  fillDropdowns() {
    this.carService.getLookUpCarModel(this.userData.companyId).subscribe(
      (res: LookUpModel[]) => this.dropdownCarModelData = res,
      (err) => console.log(err),
      () => { });

    this.technicianService.getLookUpTechnician(this.userData.branchId).subscribe(
      (res: LookUpModel[]) => this.dropdownTechnicianData = res,
      (err) => console.log(err),
      () => { });

    this.carService.getLookUpDriver(this.userData.companyId).subscribe(
      (res: LookUpModel[]) => this.dropdownDriverData = res,
      (err) => console.log(err),
      () => { });
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
