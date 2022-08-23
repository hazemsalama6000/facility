export interface IUserList {
    id: string;
    name: string;
    job: string;
    position: string;
    code: string;
    email: string;
    section: string;
    isActive: true,
    insertDate: Date;
    userType: string;
    onlineOrNot: boolean;
    imagePath: string;
    userLogs: IUserLog;
}

export interface IUserLog {

    id: number;
    userId: string;
    androidId: string;
    jobId: number;
    companyBranchId: number;
    applicationUser: string;
    expireOn: Date;
    isDeleted: false;
    insertDate: Date;
    updateDate: Date;
    deleteDate: string;
    insertBy: string;
    updateBy: string;
    deleteBy: string;
    companyTenantId: number;
}