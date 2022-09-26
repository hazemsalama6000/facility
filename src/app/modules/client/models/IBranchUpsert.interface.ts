export interface IBranchUpsert{
		id: number,
		branchName: string,
		branchAddress: string,
		isActive: boolean,
		isUseStock: boolean,
		phoneNumber: string,
		email:string,
		lockTechnicalsLogins: boolean,
		stateId: any,
		region_Id: any,
		branchManager_Id: any,
		company_Id: number,
		isMain:boolean
}