export interface IComplainSearch{
    CustomerCode?: string;
    BranchId?: number;
    AreaId?: number;
    BlockId?: number;
    CustomerId?: number;
    Employee_id?: number;
    IsRevised?:boolean;
    StartDate?: string;
    EndDate?: string;
    PageNumber: number;
    PageSize: number;
}