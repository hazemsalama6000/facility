
export interface IAddOrder {
   id: Number,
   totalPrice: Number,
   notes: string,
   orderEmployee_Id: Number,
   clientBranch_Id: Number,
   orderItems:IAddOrderItems[]
}

export interface IAddOrderItems {
    id: number,
    order_Id: number,
    notes: string,
    isRefuse: boolean,
    isRefuseNotes: string,
    canChangeQuantity: boolean,
    canRefuse: boolean,
    canScaduled: boolean,
    quantity: number,
    unitConversion_Id: number
}