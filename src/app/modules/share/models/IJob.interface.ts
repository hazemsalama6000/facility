export interface IJob {
    sectionId: number,
    jobs: IJobSub[]
}

export interface IJobSub {
    id: number,
    displayValue: string,
    isSelected: boolean
}