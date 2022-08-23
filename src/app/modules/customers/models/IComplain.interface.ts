export interface IComplainDisplay {
	id: string
	date: Date,
	collectorName: string,
	customerName: string,
	branchName: string,
	areaName: string,
	blockName: string,
	issueName: string,
	x: number,
	y: number,
	details: string,
	isRevised: boolean,
	complaintTypeName: string,
	complaintImagesPath: string[]
}