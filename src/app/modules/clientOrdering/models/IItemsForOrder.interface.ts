import { IItemProfile } from "../../items/models/itemsCategory/IItemProfile.interface";

export interface IOrderOperation{
    branchId:number,
    branchName:string,
    items:IItemsForOrder,
    total:number
}

export interface IItemsForOrder extends IItemProfile {

}