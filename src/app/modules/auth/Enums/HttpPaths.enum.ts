export enum HttpPaths {
	API_LOGIN_URL = "/api/v1/Auth/token",
	API_COMPANYCONFIG_URL = "/api/v1/Auth/CompanyConfiguration?code=",
	API_LOGINWITH_USERID = "/api/v1/Auth/logout/",
	// Jobs APIS
	API_JOB_ADD = "/api/v1/hr/addjob",
	API_JOB_UPDATE = "/api/v1/hr/updatejob/",
	API_JOB_UACTIVEDEACTIVE = "/api/v1/hr/changejobsactiveornot/",

	API_JOB_GETALL = "/api/v1/hr/getjobs",
	API_JOB_DELETE = "/api/v1/hr/deletejob/",

	API_JOB_GETPERSECTION="/api/v1/hr/GetJobsPerSection/",
	API_JOB_UPDATEJOBPERSECTION="/api/v1/hr/ManageJobSection",

	//State APIS

	API_STATE_ADD = "/api/v1/shared/addstate",
	API_STATE_UPDATE = "/api/v1/shared/updatestate/",
	API_STATE_GETALL = "/api/v1/shared/getstates",
	API_STATE_DELETE = "/api/v1/shared/deletestate/",
	API_STATE_UACTIVEDEACTIVE = "/api/v1/shared/changstateactiveornot/",

	//Region APIS

	API_REGION_ADD = "/api/v1/shared/addregion",
	API_REGION_UPDATE = "/api/v1/shared/updateregion/",
	API_REGION_GETALL = "/api/v1/shared/getallregionsbystateId",
	API_REGION_DELETE = "/api/v1/shared/deleteregion/",
	API_REGION_UACTIVEDEACTIVE = "/api/v1/shared/changeregionactiveornot/",

	//Department APIS

	API_DEPARTMENT_ADD = "/api/v1/hr/adddepartment",
	API_DEPARTMENT_UPDATE = "/api/v1/hr/updatedepartment/",
	API_DEPARTMENT_GETALL = "/api/v1/hr/getdepartments",
	API_DEPARTMENT_DELETE = "/api/v1/hr/deletedepartment/",
	API_DEPARTMENT_UACTIVEDEACTIVE = "/api/v1/hr/changedepartmentactiveornot/",
	//Section APIS

	API_SECTION_ADD = "/api/v1/hr/addSection",
	API_SECTION_UPDATE = "/api/v1/hr/updateSection/",
	API_SECTION_GETALL = "/api/v1/hr/getSections/",
	API_SECTION_DELETE = "/api/v1/hr/deleteSection/",
	API_SECTION_UACTIVEDEACTIVE = "/api/v1/hr/changesectionactiveornot/",


	//Company APIS

	API_COMPANY_ADD = "/api/v1/shared/addCompany",
	API_COMPANY_UPDATE = "/api/v1/shared/updateCompany/",
	API_COMPANY_GETALL = "/api/v1/shared/getCompanies",
	API_COMPANY_GETBYID = "/api/v1/shared/getcompanyprofile/",

	API_COMPANY_CHANGELOGOWEB = "/api/v1/shared/ChangeLogoWeb",
	API_COMPANY_CHANGELOGOPRINT = "/api/v1/shared/ChangeLogoPrint",
	API_COMPANY_ACTIVEORNOT = "/api/v1/shared/ActiveOrNot/",

	API_COMPANY_GETACTIVE = "/api/v1/shared/listofcompanies",

	//Branches APIS

	API_BRANCH_ADD = "/api/v1/shared/addcompanybranch",
	API_BRANCH_UPDATE = "/api/v1/shared/updatecompanybranch/",
	API_BRANCH_GETALL = "/api/v1/shared/getcompanybranches/",
	API_BRANCH_GETBYID = "/api/v1/shared/getcompanybranchprofile/",

	API_BRANCH_ACTIVEORNOT = "/api/v1/shared/changebranchactiveornot/",
	API_BRANCH_SALESPERSONLOCKUNLOCK = "/api/v1/shared/locktechnicianslogin/",


	//Employee APIS

	API_GET_EMPLOYEELOOKUP = "/api/v1/hr/ListOfEmployees",

	// Online Users
	API_ONLINE_USERS = "/api/v1/auth/getusers",
	API_ONLINE_USERS_FOREACH_COMPANY = "/api/v1/auth/getnumofonlineusers",
	API_ONLINE_USERES_LASTLOCATION = "/api/v1/tech/getlastlocationforuser",
	API_GET_USER_DATA = "/api/v1/auth/getuserData",
	API_USERS_CONNECTION_LOGS = "/api/v1/auth/getuserlogs",
	API_USRS_LOCATION_LOGS = "/api/v1/tech/getlocations"
}