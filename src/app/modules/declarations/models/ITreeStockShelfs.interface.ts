export interface ITreeStockShelfs {
    parent?: ITreeStockShelfs;
    children?: ITreeStockShelfs[];
    id: number;
    isActive: boolean;
    level: number;
    name: string;
    code?: string;
    parent_Id: number;
    shelf?: string;
    stock_Id?: number;
}

export class StockShelfsFlatNode {

    
constructor(
    public expandable: boolean,
    public name: string,
    public level: number,
    public id: number,
    public parent_Id: number,
    public isActive: boolean,
    public isEdit: boolean
) {}


}