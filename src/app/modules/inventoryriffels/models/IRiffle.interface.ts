import { IItemAddRiffles, IUnitConversionAddRiffles } from "./IAddRiffles.interface";

export interface IRiffle {
    id: number,
    number: string,
    date: string,
    finalSave: boolean,
    isCountingPartial: boolean,
    commmittee_Id: number,
    stock_Id: number,
    financialYear_Id: number,
    isSettlementDone: boolean;
    items: IItemRiffles[],
    notCountingItems: IItemNoCount[]
}

export interface IItemRiffles extends IItemAddRiffles {
    itemName: string,
    itemCode: string,
    itemsConversion: IUnitConversionRiffles[]
}

export interface IUnitConversionRiffles extends IUnitConversionAddRiffles {
    conversionName: string

}

export interface IItemNoCount {
    barCode: string
    code: string
    id: number
    name: string
}