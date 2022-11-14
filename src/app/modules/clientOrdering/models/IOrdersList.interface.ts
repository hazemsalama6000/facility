export interface IOrderPagination {
    totalRecords: number,
    data: IOrdersList[]
}

export interface IOrdersList {
    id: number,
    orderCode: string,
    orderDate: Date,
    totalPrice: number,
    notes: string,
    orderEmployee: string,
    clientBranch: string,
    status: IOrderStatus[],
    orderItems: IOrderItems[]
}

export interface IOrderItems {
    id: number,
    order_Id: number,
    notes: string,
    isRefuse: boolean,
    isRefuseNotes: string,
    canChangeQuantity: boolean,
    canRefuse: boolean,
    canScaduled: boolean,
    quantity: number,
    unitConversion: string,
    itemName: string
}

export interface IOrderStatus {
    id: number,
    name: string,
    sysName: string,
    txtColor: string,
    icon: string,
    ordring: number,
    notes:string,
    statusDate:Date,
    currentStatus: boolean
}