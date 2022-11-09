import { IItemProfile } from "../../items/models/itemsCategory/IItemProfile.interface";

export interface IOrderOperation {
    branchId: number,
    branchName: string,
    items: IItemsForOrder[],
    total: number
    notes:string;
}

export interface IItemsForOrder extends IItemProfile {

    CanChangeQuantity?: boolean,
    CanRefuse?: boolean,
    CanScaduled?: boolean,
}