export interface IAddTransaction {

    id: number;
    companyId: number;
    stock_Id: number;
    stockTransType_Id: number;
    documentDate: string;
    documentNumber: number;
    notes: string;
    ReceivedFromTrans_Id: number;
    financialYear_Id: number;
    transEntity: ITransEntity;
    itemData: IItem[];

}

export interface ITransEntity {
    stockTransaction_Id: number;
    vendor_Id: number;
    billVendorNumber: string,
    entityType_Id: number;
    employee_Id: number;
    department_Id: number;
    car_Id: number;
    externalVendor_Id: number;
    transferStock_Id: number

}

export interface IItem {
    indexRef: number,
    itemId: number,
    quantity: number,
    price: number,
    preConvertedQuantity: number,
    unitConversion_Id: number,
    stockTransaction_Id: number,
    stockShelf_Id?: number,
    notes?: string;
    isRefused?: boolean
}