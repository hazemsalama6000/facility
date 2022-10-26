export interface ISeachTransaction {
    DocNumber?: number;
    StartDate?: string;
    EndDate?: string;
    StockTransTypeId?: number;
    StockId?: number;
    ItemId?: number;
    VendorId?: number;
    EmployeeId?: number;
    DepartmentId?: number;
    CarId?: number;
    ExternalVendorId?: number;
    TransferStockId?: number;
    stockEmployeeId:number;
    CompanyBranchId: number;
    PageNumber: number;
    PageSize: number;
}