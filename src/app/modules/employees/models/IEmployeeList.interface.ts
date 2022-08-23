export interface IEmployeeManage {
  employeeRecords: IEmployeeList[],
  pageSize: number
}

export interface IEmployeeList {
  imagePath?: string;
  militery_Status?: string;
  martialStatus?: string;
  hR_Status?: string;
  region?: string;
  state?: string;
  job?: string;
  section?: string;
  department?: string;
  branch?: string;
  isActive?: boolean;
  techTechnician?: number;
  id?: number;
  name?: string;
  code?: number;
  address?: string;
  region_Id?: number;
  birthDate?: Date;
  mobile?: string;
  nId?: number;
  militaryStatus_Id?: number;
  martialStatus_Id?: number;
  state_Id?: number;
  job_Id?: number;
  department_Id?: number;
  section_Id?: number;
  status_Id?: number;
  university?: string;
  qualification?: string;
  graduateDate?: Date;
  jobSection_Id?: number;
  hireDate?: Date;
  branch_Id?: number;
  is_Technical?: boolean;
}
