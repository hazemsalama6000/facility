
export interface IClientDisplayedData {
	id: number,
	name: string,
	categoryName: string,
	isVatTaxActive: boolean,
	isWithHoldTaxActive: boolean,
	isActive: boolean,
	code: string,
	commercialName:string ,
	activity:string ,
	activeOrDeActiveDate: string,
	commercialRecord:string ,
	taxCardNum:string ,
	taxFileNum: string,
	vatTaxNum: string,
	vatTax:number ,
	withHoldTax: number,
//	nationalId: string,
//	companyBranch_Id: number,
	clientCategory_Id:number 
}