export interface IcarPagination {
    data: Icar[];
    totalCount: number;
}

export interface Icar {
    id: number;
    plateCar?: string;
    model_Id?: number;
    model?: string;
    CompanyBranch_Id?: number;
    branch?: string;
    technicianId?: number;
    driverId?: number;
    technician?: string;
    driver?: string;
    attachments?: any[];
}