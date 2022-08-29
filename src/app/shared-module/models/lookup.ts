export class LookUpModel {
	Id: number;
	Name: string;
	company_Id?: number;
	companyBranchId?:number;
	isActive?: boolean;
	isActiveForTechnician?:boolean;
	isEdit?:boolean = false;
	isAdd?:boolean = false;
}