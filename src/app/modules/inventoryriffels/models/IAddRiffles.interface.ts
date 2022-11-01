export interface IAddRiffles {
    id: number,
    number: string,
    date: string,
    finalSave: boolean,
    isCountingPartial: boolean,
    commmittee_Id: number,
    stock_Id: number,
    financialYear_Id: number,
    isSettlementDone: boolean;
    items: IItemAddRiffles[]
}

export interface IItemAddRiffles {
    id: number,
    itemData_Id: number,
    isIncreaseSettlement: boolean | null;
    totalStockQuantityByBaseUnit: number;
    totalCountingQuantityByBaseUnit: number;
    baseUnitConversion_Id: number;
    countingProcess_Id: number,
    itemsConversion: IUnitConversionAddRiffles[]
}

export interface IUnitConversionAddRiffles {
    id: number,
    countingQuantity: number,
    stockQuantity: number | undefined,
    itemConversion_Id: number,
    countingItem_Id: number,
    factor: number
}

