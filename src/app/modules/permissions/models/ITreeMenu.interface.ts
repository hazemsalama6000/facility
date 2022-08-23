
export interface ITreeMenu {
    parent?: ITreeMenu;
    name: string;
    icon?: string;
    isLast?: boolean;
    route?: string;
    parentId?: number;
    orderBy?:number;
    isDeleted?:boolean;
    permission?: string;
    level?: number
    id: number;
    childNode?: ITreeMenu[];
}