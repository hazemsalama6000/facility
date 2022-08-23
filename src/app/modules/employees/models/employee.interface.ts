import { IBlock } from "./IBlock.interface"
import { ITechnitianLog } from "./ITechnitianLog.interface"


export interface IEmployee {
	id: number,
	employeeName: string,
	employeeJob: string,
	branchName: string,
	userIsActive: boolean,
	isTechnician:boolean,
	blocks: IBlock[],
	technician:ITechnitianLog
}