export interface IInvTransactionPagination {
data:IInvTransaction[],
totalRecords:number;
}

export interface IInvTransaction {
    id: number,
    docNumber: number,
    docDate: string,
    transType: string,
    stockName: string,
    notes: string,
    stockTransDetails: IInvTransactionDetails[]
}

export interface IInvTransactionDetails{
    categoryName: string,
    itemName: string,
    itemCode: string,
    itemBarCode: string,
    price: number,
    baseQuantity: number,
    baseUnitName: string,
    preConvertedQuantity: number,
    preConvertedUnitName: string
  }