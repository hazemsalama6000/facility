export interface IClientUpsertModel {
    id: number,
    name: string,
    clientDataCode: string,
    clientCommercialName: string,
    activity: string,
    commercialRecord: string,
    taxCardNum: string,
    taxFileNum: string,
    vatTaxNum: string,
    vatTax: number,
    isVatTaxActive: true,
    withHoldTax: number,
    isWithHoldTaxActive: true,
    isAddedClientBranch: false,
    clientCategory_Id: number,
    companyBranch_Id: number,
	checked?:boolean, //for binding only
	regionId?:number, //for binding only
	pathRouteId?:number , //for binding 
	message?:string,
	iserrorInBranch?:boolean,
	index?:number,
    clientDataBranches: [
      {
        id?: number,
        name: string,
        clientBranchCode: string,
        address: string,
        telephone: string,
        mobile: string,
        secondMobile: string,
        managerMobile: string,
        region_Id: number,
        responsibleName: string,
        commercialName: string,
        mobileDate?: string,
        isCompletedData?: false,
        isActive: true,
        technician_Id?: number,
        x?: number,
        y?: number,
        clientData_Id?: number,
        clientBranchId: number,
        pathRoute_Id?: number,
        isMain?: false,
		checked?:boolean,
		message?:string,
		index?:number
      }
    ]
  }