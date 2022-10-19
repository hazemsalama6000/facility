export interface IRolesProfile {
    companyId: number,
    roles: IRoles[]
}

export interface IRoles {
    roleId: string;
    roleName: string;
    usersCount:number;
    claims?: string[];
    users?:IUsers[]
    creationDateTime: Date;
}

export interface IUsers {
    id: string;
    name: string;
    job: string;
    code: string;
    email: string;
    phoneNumber:string;
    userTypeId:number;
    section: string;
    isActive: boolean;
    userName:string;
    insertDate: Date;
    userType: string;
    onlineOrNot: false;
    imagePath: string;
    userLastLog: IUserLog;
    roles:string[]
}

export interface IUserLog {
    startDate: Date;
    endDate: Date;
    remainingTime: {
        days: number,
        hours: number,
        minutes: number,
        seconds: number
    },
    isMobile: boolean;
    isConnected: boolean;

}

