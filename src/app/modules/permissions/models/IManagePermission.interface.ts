import { ITreeRoles } from "./ITreeRoles.interface";

export interface IManagePermission{
    roleId: string;
    roleName?: string;
    roleTree: ITreeRoles[];
}