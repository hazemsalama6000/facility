import { IConvertedUnits } from "../../items/models/itemsCategory/IItemProfile.interface";

export interface IInvTransactionPagination {
    data: IInvTransaction[],
    totalRecords: number;
}

export interface IInvTransaction {
    id: number,
    docNumber: number,
    docDate: string,
    transType: string,
    stockName: string,
    notes: string,
    transferStock_Id: number,
    stockTransDetails: IInvTransactionDetails[]
    stockTransTypeId: number,
    entityName:string;
    entityTypeId:number;

    docReceivedDate: string,
    docReceivedNumber: number,
    stockId: number,
    financialYear_Id: number,
    // transTypeId: number
}

export interface IInvTransactionDetails {
    itemId: number,
    categoryName: string,
    itemName: string,
    itemCode: string,
    itemBarCode: string,
    price: number,
    baseQuantity: number,
    baseUnitName: string,
    preConvertedQuantity: number,
    preConvertedUnitName: string,
    reservedQuantity: number,

    receivedQuantity: number,
    quantity: number,
    remainingQuantity: number,
    receivedNotes: string,

    unitConversions: IConvertedUnits[],
    convertedUnits: IConvertedUnits
}

