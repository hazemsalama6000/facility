export enum HttpPaths {

	// Geographic Data APIs

	API_BRANCH_URL = "/api/v1/shared/listofbranches",
	API_AREA_URL = "/api/v1/shared/listofareas",
	API_BLOCK_URL = "/api/v1/shared/listofblocks",

	API_LOGIN_URL = "/api/v1/Auth/token",
	API_COMPANYCONFIG_URL = "/api/v1/Auth/CompanyConfiguration?code=",
	API_LOGINWITH_USERID = "/api/v1/Auth/logout/",
	// Jobs APIS
	API_JOB_ADD = "/api/v1/hr/addjob",
	API_JOB_UPDATE = "/api/v1/hr/updatejob/",
	API_JOB_UACTIVEDEACTIVE = "/api/v1/hr/changejobsactiveornot/",

	API_JOB_GETALL = "/api/v1/hr/getjobs",
	API_JOB_DELETE = "/api/v1/hr/deletejob/",

	API_JOB_GETPERSECTION = "/api/v1/hr/GetJobsPerSection/",
	API_JOB_UPDATEJOBPERSECTION = "/api/v1/hr/ManageJobSection",

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
	API_GET_EMPLOYEES_DATA = "/api/v1/hr/listofallemployeeswithfilter",
	API_GET_EMPLOYEEBY_ID = "/api/v1/hr/getemployeeprofile",
	API_ADD_TECHNICIAN = "/api/v1/tech/addtechnicianlog",
	API_GET_TECHNNICIAN_DATA = "/api/v1/tech/gettechnicianlogs",
	API_TOGGLE_EMPLOYEE_ACTIVE = "/api/v1/hr/changeactiveornot",
	API_TOGGLE_EMPLOYEE_TECHNICIAN = "/api/v1/tech/stoptechnician",
	API_CHANGE_EMP_IMAGE = "/api/v1/hr/changeimage",


	// Online Users
	API_ONLINE_USERS = "/api/v1/auth/getusers",
	API_ONLINE_USERS_FOREACH_COMPANY = "/api/v1/auth/getnumofonlineusers",
	API_ONLINE_USERES_LASTLOCATION = "/api/v1/tech/getlastlocationforuser",
	API_GET_USER_DATA = "/api/v1/auth/getuserData",
	API_USERS_CONNECTION_LOGS = "/api/v1/auth/getuserlogs",
	API_USRS_LOCATION_LOGS = "/api/v1/tech/getlocations",

	//Users
	API_GET_COMPANY_USERS = "/api/v1/auth/getCompanyUsers/",
	API_USER_REGISTER = "/api/v1/auth/userregister",
	API_GET_COMPANY_ROLES = "/api/v1/permissions/getrulesforcompany?CompanyId=",
	API_GET_USER_TYPE = "/api/v1/auth/getAllUserTypes",

	API_GET_USER_ROLES = "/api/v1/permissions/getuserroles?UserId=",
	API_UPDATE_USER_ROLES = "/api/v1/permissions/manageuserroles",

	API_RESET_USER_PASSWORD = "/api/v1/auth/resetUserPassWord",
	API_ACTIVE_USER_OR_NOT = "/api/v1/auth/activateuserornot?UserId=",

	//Permissions
	API_GET_ROLES_DETAILS_FOR_COMPANY = "/api/v1/permissions/getrolesdetailsforcompany?CompanyId=",
	API_GET_DEFAULT_PERMISSIONS_FOR_COMPANY = "/api/v1/permissions/getdefaultpermissionsforcompany/",
	API_MANAGE_PERMISSION_FOR_ROLE = "/api/v1/permissions/managepermissionforrole",
	API_GET_PERMISSIONS_BY_ROLE = "/api/v1/permissions/getpermissionbyrole/",
	API_ADD_ROLE = "/api/v1/permissions/addruleforcompany",
	API_UPDATE_ROLE = "/api/v1/permissions/editroleforcompany/",
	API_DELETE_ROLE = "/api/v1/permissions/deleteruleforcompany/",
	API_GET_COMPAY_ROLES = "/api/v1/permissions/getpermissionforcompanyadmin/",
	API_ADD_COMPANY_ROLES = "/api/v1/permissions/managepermissionforcompanyadmin",

	//ComplaintTypes
	API_GET_COMPLAINT_TYPE = "/api/v1/operation/getcomplainttypes",
	API_ADD_COMPLAINT_TYPE = "/api/v1/operation/addcomplainttype",
	API_UPDTAE_COMPLAINT_TYPE = "/api/v1/operation/updatecomplainttype/",
	API_DELETE_COMPLAINT_TYPE = "/api/v1/operation/deletecomplainttype/",

	//Complaints
	API_GET_COMPLAINTS = "/api/v1/operation/getcomplaints?",
	API_GET_COMPLAINTS_BY_CUSTOMERID = "/api/v1/operation/getcomplaints?",
	API_UPDATE_COMPLAINTS = "/api/v1/operation/updatecomplaint",

	//Readings
	API_GET_READINGS = "/api/v1/operation/getmeterreadings?",
	API_UPDATE_READINGS = "/api/v1/operation/updatemeterreading",

	//Customer
	API_GET_LISTOFCUSTOMER = "/api/v1/cust/listofcustomer?",
	API_GET_CUSTOMERBY_ID = "/api/v1/cust/getcustomerdataprofile?",
	API_GET_CUSTOMERBY_CODE = "/api/v1/cust/getcustomerdataprofile?",
	API_GET_CUSTOMER_BY_EMPID = "/api/v1/cust/getcustomerdatabycollector/",
	API_CUSTOMER_ISCOMPLETE = "/api/v1/cust/changecompleteddataactiveornot/",

	//Customer update
	API_GET_CUSTOMERDATA = "/api/v1/operation/getupdatedcustomers?",
	API_GET_CUSTOMERUPDATETYPE = "/api/v1/operation/listofupdatedcustomertypes",

	//Issue
	API_GET_ISSUEMASTER = "/api/v1/shared/getissues/",
	API_GET_ISSUEDETAILS = "/api/v1/shared/getissuesdetails/",

	//Bills API
	API_GET_BILLS = "/api/v1/shared/getpaymentdata?",

	//Pull Data
	API_PULL_GEOGRAPHIC_DATA = "/api/v1/shared/Managedata",
	API_PULL_EMPLOYEE_DATA = "/api/v1/hr/manageremoteemployeesdata",
	API_PULL_CUSTOMER_DATA = "/api/v1/cust/manageremotecustomers",
	API_PULL_ISSUES_DATA = "/api/v1/shared/manageissue",


	//statics
	API_GET_EMPLOYEE_STATICS = "/api/v1/shared/getdailystatisticsperemployee",
	API_GET_TWELVE_ISSUES_STATICS = "/api/v1/bill/gettoptwelveissues/",
	API_GET_DAILY_STATICS = "/api/v1/shared/getdailystatistics",

	//Menu
	API_GET_ALL_MENU="/api/v1/permissions/getadminmenu",
	API_GET_USER_MENU="/api/v1/permissions/getmenu",
	API_GET_PERMISSIONS_MENU="/api/v1/permissions/getmenupermissions",
	API_ADD_MENU="/api/v1/permissions/addpermissionmenuitem",
	API_UPDATE_MENU="/api/v1/permissions/updatepermissionmenuitem",
	API_DELETE_MENU="/api/v1/permissions/removepermissionmenuitem/",
	API_ActiveDeactive_MENU="/api/v1/permissions/changenodeactivation"



}
