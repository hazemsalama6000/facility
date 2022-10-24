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
    items: IItemRiffles[]
}

export interface IItemRiffles extends IItemAddRiffles {
    name: string,
    code:string,
    itemsConversion: IUnitConversionRiffles[]
}

export interface IUnitConversionRiffles extends IUnitConversionAddRiffles {
    unitName: string
}