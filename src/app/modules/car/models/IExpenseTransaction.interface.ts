export interface IExpenseTransaction {
	ExpenseValue: number,
	CarDataId: number,
	ExpenseId: number,
	ExpenseDate: string,
	Attachments: File[],
	Notes: string
}