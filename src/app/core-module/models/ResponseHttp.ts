

export interface HttpReponseModel {
	idOfAddedObject: number,
	errorsCount: number,
	message: string,
	isSuccess: boolean,
	isUpdated: boolean,
	isExists: boolean,
	isNotFound: boolean,
	isNotificationSuccess: boolean,
	totalPages: number,
	data: any,
	errors: Array<any>
}