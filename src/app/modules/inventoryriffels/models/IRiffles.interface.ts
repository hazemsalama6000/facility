
export interface IRifflesPaginantion {
        data:IRiffles[];
        totalRecords:number;
}


export interface IRiffles {
        id: number,
        number: string,
        date: string,
        finalSave: boolean,
        isCountingPartial: boolean,
        stockName: string
        isSettlementDone: false,
        committee: ICommmittee
}

export interface ICommmittee {
        name: string,
        date: Date,
        type: string,
        members: ICommmitteeMember[]
}

export interface ICommmitteeMember {
        name: string,
        phone: string,
        position: string
}
