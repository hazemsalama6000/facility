
export interface IBranch{
	id: number,
    branchName: string,
    branchAddress: string,
    isActive: boolean,
    isMain: boolean,
    isUseStock: boolean,
    phoneNumber: string,
    email: string,
    lockTechnicalsLogins: boolean,
    state:string,
    region: string,
    branchManager: string
}