export interface IClientExcel {
	__rowNum__:string,
	name: string,
	clientDataCode: string,
	clientCommercialName: string,
	activity: string,
	commercialRecord: string,
	taxCardNum: string,
	taxFileNum: string,
	vatTaxNum: string,
	vatTax: number,
	isVatTaxActive: true,
	withHoldTax: number,
	isWithHoldTaxActive: true,
	isAddedClientBranch: false,
	clientCategory_Id: number,
	companyBranch_Id: number
}