export interface IStockTechnique {
    id: number;
    stockTechniqueName: string;
    activateDate: Date;
    deActivateBy: string;
    deActivateBy_Id: number;
    deactivateDate: Date;
    isActive: boolean;
}