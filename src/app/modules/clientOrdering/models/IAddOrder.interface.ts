import { IConvertedUnits } from "../../items/models/itemsCategory/IItemProfile.interface";

export interface IAddOrder {
    Id: number,
    OrderEmployee_Id: number,
    ClientBranch_Id: number,
    Notes: string,
    OrderItems: IAddOrderItems[],
    TotalPrice: number,

    Status_Id: number,
    OrderCode: string,
    OrderDate: string,
}

export interface IAddOrderItems {
    Id: number,
    Order_Id: number,
    Notes: string,
    IsRefuse: boolean,
    IsRefuseNotes: string,
    CanChangeQuantity: boolean,
    CanRefuse: boolean,
    CanScaduled: boolean,
    Quantity: number,
    UnitConversion_Id: number
}

export interface IOrderItemsData extends IAddOrderItems {
    convertedUnits: IConvertedUnits[];
}