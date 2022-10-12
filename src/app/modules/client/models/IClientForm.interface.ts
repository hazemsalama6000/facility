export interface IClientForm {

	id: number,
	name: string,
	Code: string,
	CommercialName: string,
	activity: string,
	commercialRecord: string,

	taxCardNum: string,
	vatTaxNum: string,
	vatTax: number,
	isVatTaxActive: true,
	withHoldTax: number,
	isWithHoldTaxActive: true,
	isAddedClientBranch: false,
	
	clientCategory_Id: 0,
	address: string,
	telephone: string,
	mobile: string,
	secondMobile: string,
	managerMobile: string,
	state_Id:0,
	region_Id: 0,
	responsibleName: string,
	isActive: true,
	isMain: false

}