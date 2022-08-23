export interface ITechnitianLog {
	id: number,
	employeeId: number,
	isActive: boolean,
	canCollect: boolean,
	canRead: boolean,
	canComplain: boolean,
	canEditCustomer: boolean,
	attachImageRead: boolean,
	attachImageEditCustomer: boolean,
	maxOfflineWorkingHours: number,
	maxOfflineWorkingBills: number,
	insertDate:Date,
	updateDate:Date
}