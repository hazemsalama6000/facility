export interface IUserRole {
    userId: string,
    userRoles: IRole[]
}

export interface IRole {
    id: number,
    displayValue: string,
    isSelected: boolean
}

