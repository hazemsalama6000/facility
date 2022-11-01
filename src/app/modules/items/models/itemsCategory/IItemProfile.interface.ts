export interface IItemProfile {
    quantityInBaseUnit: number,
    convertedUnits: IConvertedUnits[],
    id: number,
    barCode: string,
    code: string,
    name: string,
    hasVatTax: boolean,
    vatTaxValue: number,
    description: string,
    hasExpireDate: boolean,
    convertedUnitOfMeasure: boolean,
    isActive: boolean,
    maxLimit: number,
    minLimit: number,
    orderingLimit: number,
    nature: boolean,
    itemCategory_Id: number,
    category: string,
    unit_Id: number,
    unit: string,

    quantity:number,
    price:number,
    convertedUnit:IConvertedUnits,
    total:number,
    preconvertedQuantity:number,
    indexRef:number,
    isRefused: boolean

}

export interface IConvertedUnits {
    unitConversionId: number,
    convertedUnitName: string,
    factor: number,
    quantityInExcutedUnit: number,
    quantityReminigOfUnits?:number,
    isBaseUnit: boolean
    riffleQuantity?:number;
}

