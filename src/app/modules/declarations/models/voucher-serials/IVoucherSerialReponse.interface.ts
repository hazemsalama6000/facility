export interface IVoucherSerialReponse {
	id: number,
	billType: string,
	startDate: string,
	endDate: string,
	fromSerial: number,
	toSerial: number,
	totalSerials: number,
	availableSerials: number,
	lastUsedSerial: number,
	nextSerial: number,
	technicianName: string,
	employeeId: number,
	isDeleted: boolean
}