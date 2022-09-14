import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { Icar } from '../../../models/ICar.interface';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-unassigncar',
  templateUrl: './unassigncar.component.html',
  styleUrls: ['./unassigncar.component.scss']
})
export class UnassigncarComponent {
  loading: boolean = false;
  saveButtonClickedFlag = false;
  files: string[] = [];
  userData: IUserData;
  dropdownTechnicianData: LookUpModel[] = [];
  private unsubscribe: Subscription[] = [];

  carUnAssignForm: FormGroup = this.fb.group({
    carId: [0],
    notes: [''],
    file: ['']
  });

  constructor(
    private carService: CarService,
    private auth: AuthService,
    private toaster: toasterService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { carModel: Icar, isTechnician: boolean },
    public dialogRef: MatDialogRef<UnassigncarComponent>
  ) {
    const udata = this.auth.userData.subscribe(res => this.userData = res);
    this.unsubscribe.push(udata);
    this.carUnAssignForm.patchValue({ carId: this.data.carModel.id, driverId: this.data.carModel.id, technicianId: this.data.carModel.id });

  }


  addAssignToCar() {

    if (this.carUnAssignForm.valid && this.saveButtonClickedFlag) {
      this.loading = true;

      if (this.data.isTechnician) {
        this.carService.UnAssignCarToTechincian(this.createFormData()).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.carService.bSubject.next(false);
              this.carService.refreshHistoryData();
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
          });
      } else {
        this.carService.UnAssignCarToDriver(this.createFormData()).subscribe(
          (data: HttpReponseModel) => {
            this.loading = false;
            if (data.isSuccess) {
              this.carService.bSubject.next(false);
              this.carService.refreshHistoryData();
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
          });
      }
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
      formData.append("File", new Blob(), 'test');

    formData.append("carId", this.carUnAssignForm.get('carId')?.value);
    formData.append("Notes", this.carUnAssignForm.get('notes')?.value);

    return formData;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
