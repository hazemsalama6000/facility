export interface IItem {
    id: number;
    barCode: string;
    code: string;
    name: string;
    hasVatTax: boolean;
    vatTaxValue: number;
    quantity: number;
    description: string;
    hasExpireDate: boolean;
    expirationDate: Date;
    convertedUnitOfMeasure: boolean;
    isActive: boolean;
    maxLimit: number;
    minLimit: number;
    orderingLimit: number;
    nature: boolean;
	natureName?:string;
    itemCategory_Id: number;
	itemCategoryName?:string;
    unit_Id: number;
	unitName?:string;
    company_Id: number;
	checked?:boolean;
	errorMessage?:string;
	index?:number;

}