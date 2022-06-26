import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IJob } from 'src/app/modules/share/models/IJob.interface';
import { JobService } from 'src/app/modules/share/Services/job.service';

@Component({
  selector: 'app-job_upsert',
  templateUrl: './job_upsert.component.html',
  styleUrls: ['./job_upsert.component.scss']
})
export class Job_upsertComponent implements OnInit {

  jobData: IJob = { sectionId: 0, jobs: [] };

  constructor(public dialogRef: MatDialogRef<Job_upsertComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private toaster: toasterService, private jobService: JobService) {
    if (this.data.sectionId != 0) {
      this.jobService.getLookUpData(this.data.sectionId).subscribe((res) => { this.jobData = res.data;});
    }
  }

  ngOnInit() {

  }

  save() {
    this.jobService.postLookUpData(this.jobData).subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          console.log(data);
          this.jobData = { sectionId: 0, jobs: [] }
          this.toaster.openSuccessSnackBar(data.message);
          this.dialogRef.close();
        }
        else if (data.isExists) {
          this.toaster.openWarningSnackBar(data.message);
        }
      },
      (error: any) => {
        console.log(error);
        this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
      }
    );
  }

}
