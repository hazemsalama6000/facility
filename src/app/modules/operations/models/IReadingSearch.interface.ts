export interface IReadingSearch {
    CustomerCode?: string;
    BranchId?: number;
    AreaId?: number;
    BlockId?: number;
    CustomerId?: number;
    Employee_id?: number;
    StartDate?: string;
    EndDate?: string;
    IsPosted?:boolean;
    IsRevised?:boolean;
    PageNumber?: number;
    PageSize?: number;
}