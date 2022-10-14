export interface IReservedItem{
    id: number,
    itemName: string,
    itemCode: string,
    remainingQuantity: number,
    reservedQuantity: number,
    price: number,
    docNumber: number,
    docDate: Date
}