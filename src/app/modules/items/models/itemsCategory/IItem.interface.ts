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
    itemCategory_Id: number;
    unit_Id: number;
    company_Id: number;
	checked?:boolean;
	errorMessage?:string;
}