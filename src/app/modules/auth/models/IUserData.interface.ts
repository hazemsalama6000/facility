import { ITreeMenu } from "../../permissions/models/ITreeMenu.interface";

export interface IUserData {
    appHasTutorial: boolean;
    branchId: number;
    companyCode: string;
    companyId: number;
    email: string;
    employeeId: number;
    fullName: string;
    imgPath: string;
    isAuthenticated: boolean;
    jobId: number;
    refreshToken: string;
    roles: string[];
    technician_Id: number;
    userCode: string;
    userId: string;
    userName: string;
    menu:ITreeMenu[];
}