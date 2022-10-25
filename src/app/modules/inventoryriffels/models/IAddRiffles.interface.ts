export interface IAddRiffles {
    id: number,
    number: string,
    date: string,
    finalSave: boolean,
    isCountingPartial: boolean,
    commmittee_Id: number,
    stock_Id: number,
    financialYear_Id: number,
    items: IItemAddRiffles[]
}

export interface IItemAddRiffles {
    id: number,
    itemData_Id: number,
    countingProcess_Id: number,
    itemsConversion: IUnitConversionAddRiffles[]
}

export interface IUnitConversionAddRiffles {
    id: number,
    countingQuantity: number,
    stockQuantity: number,
    itemConversion_Id: number,
    countingItem_Id: number
}

