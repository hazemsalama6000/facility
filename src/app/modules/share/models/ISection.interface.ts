

export interface ISection {
	id: number,
	name: string,
	department_Id: number,
	Company_Id?:number,
	isActive:boolean,
	isEdit:boolean,
	isAdd:boolean
}