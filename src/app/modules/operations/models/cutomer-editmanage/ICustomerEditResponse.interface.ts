
export interface ICustomerEditResponse {
	id: number,
	branchName: string,
	areaName: string,
	blockName: string,
	customerName: string,
	customerCode: string,
	collectorName: string,
	requestDate: Date,
	updatedTypeName: string,
	updatedTypeSysName: 'location' | 'activity' | 'unitsnumber' | 'customerimage'//location => 1, activity =>2, unitsnumber => 3, customerimage => 4
	customerActivity: string,
	numOfUnits: number,
	imagePath: string,
	x: number,
	y: number,
}