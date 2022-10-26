export interface IAddVendor {
    id:number
    code: string,
    name: string,
    address: string,
    telephone: string,
    mobile: string,
    commercialRecord: string,
    taxFileNum: string,
    email: string,
    site: string,
    vatTax: number,
    isVatTaxActive: boolean,
    withHoldTax: number,
    isWithHoldTaxActive: boolean,
    isActive: boolean,
    classification_Id: number,
    mainCompany_Id: number,
    activity_Id: number,
    taxOffice_Id: number,
    branch_Id: number
}