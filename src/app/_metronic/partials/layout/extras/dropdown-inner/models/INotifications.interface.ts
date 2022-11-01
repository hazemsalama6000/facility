export interface INotificationsPagination {
    messagesRecords: INotifications[],
    totalCount: number;
}

export interface INotifications {
    sender: string,
    reciever: string,
    messageDate: Date,
    image: string,
    refId:string,
    messageTypeSysName: string,
    userSender_Id: string,
    readOnly: boolean,
    title: string,
    message: string,
    userId: string
}