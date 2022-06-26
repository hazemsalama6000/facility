export interface ICompanyDisplayData {
	id: number,
	code?: string,
	companyName: string,
	activity?: string,
	address: string,
	phoneNumber?: number,
	logoWeb?: string,
	logoPrint?: string,
	hasDirectTransferForStocks?: boolean,
	email?: string,
	isActive?: boolean,
	mobileUsersCount?: number,
	state?: string,
	region?: string,
	managerName?: string,
	managerPosition?: string,
	roleName?: string,
	commercialRecord: string,
	taxCardNo: string,
	wTax: string
	vatTax: string
}