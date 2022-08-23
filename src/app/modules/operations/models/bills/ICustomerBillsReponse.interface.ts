import { IBillTransactions } from "./IBillTransactions.interface"

export interface ICustomerBIllsReponse {
	branch: string,
	area: string,
	block: string,
	customerName: string,
	collectorName: string,
	customerCode:string,
	id: number,
	customerData_Id: number
	employee_Id: number,
	notes: string,
	payDate: Date,
	totalAmount:number,
	billTransactions:IBillTransactions[]
}
