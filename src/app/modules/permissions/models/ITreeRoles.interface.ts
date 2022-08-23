export interface ITreeRoles {
    parent?: ITreeRoles;
    name: string;
    name_Ar: string;
    level?:number
    id: number;
    isSelected?: boolean;
    children?: ITreeRoles[];
    indeterminate?: boolean;
}