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
    stockTransDetails: IInvTransactionDetails[]

    docReceivedDate:string,
    docReceivedNumber:number,
    stockId:number,
    financialYear_Id:number,
    transTypeId:number
    receivedNotes:string,
}

export interface IInvTransactionDetails {
    categoryName: string,
    itemName: string,
    itemCode: string,
    itemBarCode: string,
    price: number,
    baseQuantity: number,
    baseUnitName: string,
    preConvertedQuantity: number,
    preConvertedUnitName: string,

    receivedQuantity: number,
    remainingQuantity: number,
    convertedUnits: IConvertedUnits[],
    convertedUnit: IConvertedUnits
}