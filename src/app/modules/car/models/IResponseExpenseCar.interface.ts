
export interface IReponseExpenseCar{
	
	id: number,
	expenseValue: number,
	carDataId: number,
	carNumber: string,
	expenseId: number,
	expense: string,
	approvedOrRejectBy: string,
	approvedOrRejectDate: string,
	mobileDate: string,
	expenseDate: string,
	x: number,
	y: number,
	expenseLocationPhone: string,
	notes: string,
	attachments: [
	  {
		id: number,
		path: string
	  }
	]

}

