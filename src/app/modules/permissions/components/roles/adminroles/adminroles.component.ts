import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { CompanyService } from 'src/app/modules/hr/services/company.service';
import { LookUpModel } from 'src/app/shared-module/models/lookup';
import { ICompanyRoles } from '../../../models/ICompanyRoles.interface';
import { IRolesProfile } from '../../../models/IRolesProfile.interface';
import { ITreeRoles } from '../../../models/ITreeRoles.interface';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-adminroles',
  templateUrl: './adminroles.component.html',
  styleUrls: ['./adminroles.component.scss']
})
export class AdminrolesComponent implements OnInit {
  saveButtonClickedFlag = false;

  rolesData: IRolesProfile;
  treePermissions: ITreeRoles[];
  companies: LookUpModel[];
  private unsubscribe: Subscription[] = [];

  roleForm: FormGroup = this.fb.group({
    companyId: [0, [Validators.required]],
  });
  constructor(
    private rolesService: RolesService,
    private companyService: CompanyService,
    private toaster: toasterService,
    private fb: FormBuilder,
  ) {
    this.getlistOfCompanies();

    let getPermission = rolesService.permissionTree.subscribe(res => this.treePermissions = res);
    this.unsubscribe.push(getPermission);
  }

  ngOnInit(): void { }

  getlistOfCompanies() {
    this.companyService.getActiveCompanies().subscribe(
      (res: LookUpModel[]) => { this.companies = res },
      (err) => console.log(err),
      () => { }
    )
  }

  getCompanyRoles() {
    this.rolesService.permissionTree.next([]);
    this.rolesService.GetCompanyRole(this.roleForm.get('companyId')?.value).subscribe(
      (res: ICompanyRoles) => {
        this.roleForm.patchValue({ companyId: res.companyId });
        this.rolesService.permissionTree.next(res.roleTree);
        this.saveButtonClickedFlag=false;
      },
      (err) => console.log(err),
      () => { }
    )
  }

  addRole() {
    if (this.roleForm.valid && this.saveButtonClickedFlag) {
      this.removeParent(this.treePermissions);
      let companyRole: ICompanyRoles = { companyId: this.roleForm.get('companyId')?.value, roleTree: this.treePermissions }
      this.rolesService.AddCompanyRole(companyRole).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.toaster.openSuccessSnackBar(data.message);
            this.rolesService.bSubject.next(true);
            this.roleForm.reset();
            this.saveButtonClickedFlag = false;
            this.treePermissions = [];
            // console.log(this.treePermissions)
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

  removeParent(arr?: ITreeRoles[]) {
    arr?.map(x => {
      delete x.parent
      if ((x?.children?.length ?? 0) > 0) {
        this.removeParent(x?.children);
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
