export interface IVoucherSerialUpsert {

	id: number,
	fromSerial: number,
	toSerial: number,
	financialYear_Id: number,
	billType_Id: number,
	technician_Id: number,
	company_Id: number

}