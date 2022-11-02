export class CommitteeResponse {
    id : Number
    commmitteeDate : Date
    commmitteeType_Id : Number
    discription : string
    isActive : boolean
    members : Members[]
}
export class Members{
    id : Number
    name : string
}