export interface ICarLogs{
    id: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    notes: string;
    technician_Id:  number;
    technicianName:string,
    driver_Id: number;
    driverName: string,
    attachments: []
    activeOrDeActiveDate: boolean
    isTechnicianUpdated: boolean
    carData_Id:number
    eventDisc: string;
}