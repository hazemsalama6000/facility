export interface ICarLogs {
    allLogs: ICarLog[];
    driverLastLog: ICarLastLog;
    techLastLog: ICarLastLog
}

export interface ICarLog {
    id: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    notes: string;
    attachments: []
    activeOrDeActiveDate: boolean
    isTechnicianUpdated: boolean
    carData_Id: number
    eventDisc: string;
    personName: string
    person_Id: number
}

export interface ICarLastLog {
    isTechnicianUpdated: boolean;
    person_Id: number;
    personName: string;
    startDate: Date;
    endDate: Date;
    eventDisc: string
}

