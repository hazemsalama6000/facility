export interface IPathRoutePaginantion{
    data:IPathRoute[];
    totalRecords:number;
}
export interface IPathRoute{
    id:number;
    name:string;
    region:string;
    state:string;
    technician:string;
    isActive:boolean;
}