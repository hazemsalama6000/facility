
export interface IReponseExpenseCar{
	
	id: number,
	expenseValue: number,
	carDataId: number,
	carNumber: string,
	expenseId: number,
	expenseType: string,
	approvedOrRejectBy: string,
	approvedOrRejectDate: string,
	mobileDate: string,
	expenseDate: string,
	x: number,
	y: number,
	expenseLocationPhone: string,
	notes: string,
	isRecievedMobile:boolean,
	isWaiting:boolean,
	isRejected:boolean,
	attachments: [
	  {
		id: number,
		path: string
	  }
	]

}

