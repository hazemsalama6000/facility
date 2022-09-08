export interface IItemsCategory {
    id: number;
    name: string;
    type: string;
    isActive: boolean;
    parentId: number;
    company_Id: number;
    children: IItemsCategory[];

}

export class IItemsCategoryFlat implements IItemsCategory {
    id: number;
    name: string;
    type: string;
    isActive: boolean;
    parentId: number;
    company_Id: number;
    children: IItemsCategory[];

    level: number;
    expandable: boolean;
}