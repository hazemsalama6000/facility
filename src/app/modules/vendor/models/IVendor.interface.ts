export interface IVendor {
    code: string;
    name: string;
    mobile: string;
    address: string;
    telephone: string;
    commercialRecord: string ;//السجل التجارى
    taxFileNum: string;//رقم الملف الضريبى
    email: string;
    site: string;
    vatTax: number  ;         //قيمة الضريبة المضافة
    isVatTaxActive: boolean;
    withHoldTax: number;        //ضريبة الخصم
    isWithHoldTaxActive: boolean;
    isActive: boolean;
    classification_Id: number;
    mainCompany_Id: number;
    activity_Id: number;
    taxOffice_Id: number;
    branch_Id: number;
    classification: string;
    mainCompany: string;
    activity: string;
    taxOffice: string;
    branch: string;
    id:number
}