export interface IReading {
    data: IReadingList[],
    totalRecords: number
} 

export interface IReadingList {
    id :number;
    collectorId: number;
    collectorName: string;
    customerId: number;
    customerName: string;
    customerCode: string;
    branchName: string;
    value: number;
    lastReading :number;
    x: number;
    y: number;
    meterStatus: string;
    readingImagePath: string;
	actualreadingImagePath?:string,
    issueName: string;
    issueStatus: string;
    issueDate: Date;
    isRevised: boolean;
    lastRevised?: boolean;
    isPosted: boolean;
    lastPosted?:boolean;
    notes :string;
    meterReadingDate:Date;
} 