export interface ICompany {
	commercialRecord: string
	taxCardNo: string,
	taxFileNo: string,
	vatTaxNum: string
	vatTax: string,
	isValTaxActive: boolean,
	hasDirectTransferForStocks: boolean,
	wTax: string,
	isWTaxActive: boolean,
	state_Id: number
	region_Id: number,
	managerName: string,
	managerPosition: string,
	employee_Id: number;
	activity: string;
	address: string;
	code: string;
	companyName: string;
	companyServiceName: string;
	email: string;
	id: number;
	isActive: boolean;
	logoPrint: string;
	logoWeb: string;
	mobileUsersCount: number;
	phoneNumber: string;

}