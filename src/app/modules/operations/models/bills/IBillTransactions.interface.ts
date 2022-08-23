export interface IBillTransactions {

		id: number,
		amount: number,
		bill_Id: number,
		billPayment_Id: number,
		customer_Id: number,
		billNum: number,
		billIssue_Id: number,
		payDate: Date,
		billValue: number,
		waterValue: number,
		installment: number,
		others: number,
		maintenance: number,
		contenutityService: number,
		regularityService: number,
		waterInstallment: number,
		wastWaterInstallment: number,
		tax14Percent: number,
		customerPayingDate: Date
	  
}