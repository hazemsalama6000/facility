export enum HttpPaths {

	// Geographic Data APIs

	API_BRANCH_URL = "/api/v1/shared/listofcompanybranches",
	API_AREA_URL = "/api/v1/shared/listofareas",
	API_BLOCK_URL = "/api/v1/shared/listofblocks",

	API_LOGIN_URL = "/api/v1/Auth/token",
	API_COMPANYCONFIG_URL = "/api/v1/Auth/CompanyConfiguration?code=",
	API_LOGINWITH_USERID = "/api/v1/Auth/logout/",
	// Jobs APIS
	API_JOB_ADD = "/api/v1/hr/addjob",
	API_JOB_UPDATE = "/api/v1/hr/updatejob/",
	API_JOB_UACTIVEDEACTIVE = "/api/v1/hr/changejobsactiveornot/",

	API_JOB_GETALL = "/api/v1/hr/getjobs/",
	API_JOB_DELETE = "/api/v1/hr/deletejob/",

	API_JOB_GETPERSECTION = "/api/v1/hr/GetJobsPerSection/",
	API_JOB_UPDATEJOBPERSECTION = "/api/v1/hr/ManageJobSection",
	API_JOB_GET_LISTJOBPERSECTION = "/api/v1/hr/listofjobspersection",

	//State APIS

	API_STATE_ADD = "/api/v1/shared/addstate",
	API_STATE_UPDATE = "/api/v1/shared/updatestate/",
	API_STATE_GETALL = "/api/v1/shared/getstates",
	API_STATE_DELETE = "/api/v1/shared/deletestate/",
	API_STATE_UACTIVEDEACTIVE = "/api/v1/shared/changstateactiveornot/",

	//militaryStatus
	API_MILITARYSTATUS_GETLIST = "/api/v1/hr/listofmilitarystatus",

	//maritalStatus
	API_MARITALSTATUS_GETLIST = "/api/v1/hr/listofmartialstatus",

	API_STATUS_GETLIST = "/api/v1/hr/listofhrstatus",

	//Transfering Company APIS

	API_TRANSFERINGCOMPANY_ADD = "/api/v1/bill/addpaymentgateway",
	API_TRANSFERINGCOMPANY_UPDATE = "/api/v1/bill/updatepaymentgateway/",
	API_TRANSFERINGCOMPANY_GETALL = "/api/v1/bill/getallpaymentgateways",
	API_TRANSFERINGCOMPANY_DELETE = "/api/v1/bill/deletepaymentgateway/",
	API_TRANSFERINGCOMPANY_UACTIVEDEACTIVE = "/api/v1/bill/changepaymentgatewayactiveornot/",

	//UNITS
	API_UNITS_ADD = "/api/v1/invt/addunit",
	API_UNITS_UPDATE = "/api/v1/invt/updateunit/",
	API_UNITS_GETALL = "/api/v1/invt/getallunits",
	API_UNITS_DELETE = "/api/v1/invt/deleteunit/",
	API_UNITS_UACTIVEDEACTIVE = "/api/v1/invt/changeunitactiveornot/",

	API_LIST_OF_UNITTYPES = "/api/v1/invt/listofunitstypes",

	//Cars Models APIS

	API_CARS_MODELS_ADD = "/api/v1/Trans/addtranscarmodel",
	API_CARS_MODELS_UPDATE = "/api/v1/Trans/updatetranscarmodel/",
	API_CARS_MODELS_GETALL = "/api/v1/Trans/getcarsmodels/",
	API_CARS_MODELS_DELETE = "/api/v1/Trans/removetranscarmodel/",
	//API_CARS_MODELS_UACTIVEDEACTIVE = "/api/v1/bill/changepaymentgatewayactiveornot/",


	//Cars expense APIS

	API_CARS_EXPENSE_ADD = "/api/v1/Trans/addtranscarexpensetypes",
	API_CARS_EXPENSE_UPDATE = "/api/v1/Trans/updatetranscarexpensetypes/",
	API_CARS_EXPENSE_GETALL = "/api/v1/Trans/getcarsexpensestypes",
	API_CARS_EXPENSE_GETList = "/api/v1/Trans/listofcarsExpensesTypes",

	API_CARS_EXPENSE_DELETE = "/api/v1/Trans/removetranscarexpensetypes/",

	API_CARS_EXPENSE_UACTIVEDEACTIVE = "/api/v1/Trans/changeexpensetypeactiveandenactiv/",
	API_CARS_EXPENSE_ASSIGN_SALES_UACTIVEDEACTIVE = "/api/v1/Trans/changeexpensetechnicianactiveandenactive/",

	// cars expenses transactions

	API_GET_CARS_EXPENSES_ADD = "/api/v1/Trans/addtranscarexpense",
	API_GET_CARS_EXPENSES = "/api/v1/Trans/getcarsexpenses?",
	API_CARS_EXPENSETRANSACTION_DELETE = "/api/v1/Trans/removetranscarexpense/",

	API_CARS_EXPENSES_IMAGES = "/api/v1/Trans/uploadcarexpensesimages",
	API_CARS_EXPENSES_ACCEPT = "/api/v1/Trans/acceptcarexpense/",
	API_CARS_EXPENSES_REJECT = "/api/v1/Trans/rejectcarexpense/",

	// cars 
	API_CARS_DROPDOWNS = "/api/v1/Trans/listofcarData",


	API_LISTOF_TECHNITIANS = "/api/v1/tech/listoftechnicians",

	//VoucherSerial APIS

	API_VOUCHER_SERIAL_ADD = "/api/v1/bill/addbillsbook",
	API_VOUCHER_SERIAL_GETALL_SEARCH = "/api/v1/bill/getbillsbooksbyfilteration",
	API_VOUCHER_SERIAL_DELETE = "/api/v1/bill/deletebillsbook/",
	API_GET_BILLS_TYPES = "/api/v1/bill/listofbillstypes",
	// unit Conversion

	API_UNIT_CONVERSION_ADD = "/api/v1/invt/addunitofconversion",
	API_UNIT_CONVERSION_GETALL = "/api/v1/invt/getallunitsofconversion",
	API_UNIT_CONVERSION_DELETE = "/api/v1/invt/deleteunitofconversion/",
	API_UNIT_CONVERSION_UACTIVEDEACTIVE = "/api/v1/invt/changeunitofconversionactiveornot/",

	// units
	API_GET_UNITS_RELATEDTO_ITEM_CRITERIA = "/api/v1/invt/getallconvertedunits",
	API_GET_MAIN_UNITS = "/api/v1/invt/getmainunit",
	API_LIST_OF_UNITS = "/api/v1/invt/listofunits",

	//Items
	API_GET_ITEMS_LOOKUP = "/api/v1/invt/listofinvitems/",

	//Region APIS
	API_REGION_ADD = "/api/v1/shared/addregion",
	API_REGION_UPDATE = "/api/v1/shared/updateregion/",
	API_REGION_GETALL = "/api/v1/shared/getallregionsbystateId",
	API_REGION_DELETE = "/api/v1/shared/deleteregion/",
	API_REGION_UACTIVEDEACTIVE = "/api/v1/shared/changeregionactiveornot/",

	//Department APIS

	API_DEPARTMENT_ADD = "/api/v1/hr/adddepartment",
	API_DEPARTMENT_UPDATE = "/api/v1/hr/updatedepartment/",
	API_DEPARTMENT_GETALL = "/api/v1/hr/getdepartments?CompanyId=",
	API_DEPARTMENT_DELETE = "/api/v1/hr/deletedepartment/",
	API_DEPARTMENT_UACTIVEDEACTIVE = "/api/v1/hr/changedepartmentactiveornot/",
	API_LIST_OF_DEPARTMENT = "/api/v1/hr/listofdepartments?CompanyId=",

	//Section APIS

	API_SECTION_ADD = "/api/v1/hr/addSection",
	API_SECTION_UPDATE = "/api/v1/hr/updateSection/",
	API_SECTION_GETALL = "/api/v1/hr/getSections/",
	API_LIST_OF_SECTION = "/api/v1/hr/listOfSections?departmentId=",
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

	API_GET_EMPLOYEELOOKUP = "/api/v1/hr/listOfEmployees",
	API_GET_EMPLOYEES_DATA = "/api/v1/hr/getofallemployeeswithfilter",
	API_GET_EMPLOYEEBY_ID = "/api/v1/hr/getemployeeprofileinfo",
	API_GET_EMPLOYEEBY_UPDATE_ID = "/api/v1/hr/getemployeeprofile",
	API_ADD_TECHNICIAN = "/api/v1/tech/addtechnicianlog",
	API_GET_TECHNNICIAN_DATA = "/api/v1/tech/gettechnicianlogs",
	API_TOGGLE_EMPLOYEE_ACTIVE = "/api/v1/hr/changeactiveornot",
	API_TOGGLE_EMPLOYEE_TECHNICIAN = "/api/v1/tech/stoptechnician",
	API_CHANGE_EMP_IMAGE = "/api/v1/hr/changeimage",
	API_POST_ADD_EMPLOYEE = "/api/v1/hr/createemployee",
	API_POST_UPDATE_EMPLOYEE = "/api/v1/hr/editemployee/",




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
	API_EDIT_USER = "/api/v1/auth/updateuser/",
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
	API_GET_USER_BRANCHES = "/api/v1/auth/getuserbranches?userId=",
	API_CHANGE_PASSWORD = "/api/v1/auth/ChangePassword",

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
	API_GET_ALL_MENU = "/api/v1/permissions/getadminmenu",
	API_GET_USER_MENU = "/api/v1/permissions/getmenu",
	API_GET_PERMISSIONS_MENU = "/api/v1/permissions/getmenupermissions",
	API_ADD_MENU = "/api/v1/permissions/addpermissionmenuitem",
	API_UPDATE_MENU = "/api/v1/permissions/updatepermissionmenuitem",
	API_DELETE_MENU = "/api/v1/permissions/removepermissionmenuitem/",
	API_ACTIVEDEACTIVE_MENU = "/api/v1/permissions/changenodeactivation",



	//financial year
	API_GET_FINANCIAL_YEAR = "/api/v1/shared/getfinancialyears/",
	API_GET_ACTIVE_FINANCIAL_YEAR = "/api/v1/shared/getactivefinancialyear/",
	API_LIST_OF_FINANCIAL_YEAR = "/api/v1/shared/listoffinancialyears/",
	API_ADD_FINANCIAL_YEAR = "/api/v1/shared/addfinancialyear",
	API_DEACTIVE_FINANCIAL_YEAR = "/api/v1/shared/changefinancialyearactiveornot?",
	API_CHECK_FINANCIAL_YEAR = "/api/v1/shared/checkdateinrange?",

	//path route

	API_LIST_OF_STATES = "/api/v1/shared/listofstates",
	API_LIST_OF_REGIONS = "/api/v1/shared/listofregions?",
	API_LIST_OF_TECHNICIAN = "/api/v1/tech/listoftechnicians?companyBranchId=",
	API_LIST_OF_PATHROUTE = "/api/v1/route/listofpathroutes?",
	API_GET_PATH_ROUTE = "/api/v1/route/getallpathroutes?",
	API_ADD_PATH_ROUTE = "/api/v1/route/addpathroute",
	API_ACTIVE_DEACTIVE_PATH_ROUTE = "/api/v1/route/changepathrouteactiveornot/",
	API_ASSIGN_PATH_ROUTE_TO_TECHNICAIN = "/api/v1/route/replacetechwithanother?",
	API_UNASSIGN_PATH_ROUTE_TO_TECHNICAIN = "/api/v1/route/removetechfrompathroute?pathRouteId=",


	//CARS
	API_LIST_OF_DRIVER = "/api/v1/hr/listofcardrivers?",
	API_GET_CARS = "/api/v1/Trans/getcars?",
	API_ADD_CAR = "/api/v1/Trans/addtranscar",
	API_UPDATE_CAR = "/api/v1/Trans/updatetranscardata/",
	API_ASSIGN_CAR_TO_TECHNICAIN = "/api/v1/Trans/assigncartotechnician",
	API_UNASSIGN_CAR_TO_TECHNICAIN = "/api/v1/Trans/unssigncartotechnician",
	API_ASSIGN_CAR_TO_DRIVER = "/api/v1/Trans/assigncartodriver",
	API_UNASSIGN_CAR_TO_DRIVER = "/api/v1/Trans/unssigncartodriver",
	API_LIST_OF_CAR_MODEL = "/api/v1/Trans/listofcarsmodels/",
	API_GET_OF_CAR_LOGS = "/api/v1/Trans/getcarlogs?",
	API_LIST_OF_CARS = "/api/v1/Trans/listofcar",

	//inventory Category
	API_LIST_OF_INVENTORY_CATEGORY = "/api/v1/invt/listofstockcategory?companyId=",
	API_GET_INVENTORY_CATEGORY = "/api/v1/invt/getstockcategorys?companyId=",
	API_ADD_INVENTORY_CATEGORY = "/api/v1/invt/addstockcategory",
	API_UPDATE_INVENTORY_CATEGORY = "/api/v1/invt/updatestockcategory/",
	API_DELETE_INVENTORY_CATEGORY = "/api/v1/invt/deletestockcategory/",

	//Inventory
	API_GET_INVENTORY = "/api/v1/invt/getallstocks?companyBranchId=",
	API_LIST_INVENTORY = "/api/v1/invt/listofstocks?companyBranchId=",
	API_LIST_STOCK_KEEPERS = "/api/v1/invt/listofstockkeepers?companyBranchId=",
	API_ADD_INVENTORY = "/api/v1/invt/addstock",
	API_DELETE_INVENTORY = "/api/v1/invt/deletestock/",
	API_ACTIVEDEACTIVE_INVENTORY = "/api/v1/invt/changestockactiveornot/",
	API_ASSIGN_EMPLOYEE_TO_INVENTORY = "/api/v1/invt/assignemployeetostock?",
	API_GET_STOCK_KEEPER = "/api/v1/invt/getallstocksKeeperslogs?stockId=",

	//Stock Technkique
	API_GET_STOCK_TECHNIQUE = "/api/v1/invt/getstocktechniquelogs?stockId=",
	API_LIST_OF_STOCK_TECHNIQUE = "/api/v1/invt/listofstocktechnique",
	API_ADD_STOCK_TECHNIQUE = "/api/v1/invt/addstocktechniquelog",
	API_DEACTIVE_STOCK_TECHNIQUE = "/api/v1/invt/stopstocktechniquelog",


	//Stock shelfs
	API_LIST_OF_STOCK_SHELFS = "/api/v1/invt/getinvstockshelfs?stockId=",
	API_ADD_STOCK_SHELFS = "/api/v1/invt/addnewstockshelf",
	API_UPDATE_STOCK_SHELFS = "/api/v1/invt/updateinvstockshelfname/",
	API_UPDATE_PARENT_STOCK_SHELFS = "/api/v1/invt/updateinvstockshelfparentid/",
	API_ACTIVE_DEACTIVE_STOCK_SHELFS = "/api/v1/invt/activateordeactivatestockshelf/",

	// CLIENT_CATEGORY_APIS
	API_CLIENT_CATEGORY_ADD = "/api/v1/cust/addclientcategory",
	API_CLIENT_CATEGORY_UPDATE = "/api/v1/cust/updateclientcategory/",
	API_CLIENT_CATEGORY_UACTIVEDEACTIVE = "/api/v1/cust/changeclientcategoryactiveornot/",
	API_CLIENT_CATEGORY_GETALL = "/api/v1/cust/getallclientcategories?companyId=",
	API_CLIENT_CATEGORY_DELETE = "/api/v1/cust/deleteclientcategory/",
	API_CLIENT_CATEGORY_LIST = "/api/v1/cust/listofclientcategories?companyId=",


	// CLIENT_APIS
	API_CLIENT_ADD = "/api/v1/cust/addclientdata",
	API_CLIENT_UPDATE = "/api/v1/cust/updateclientdata/",
	API_CLIENT_UACTIVEDEACTIVE = "/api/v1/cust/changeclientdataactiveornot/",
	API_CLIENT_GETALL = "/api/v1/cust/getclientsdatabyfilteration?",
	API_CLIENT_GETPROFILE = "/api/v1/cust/getclientprofile?",

	API_CLIENT_DELETE = "/api/v1/cust/deleteclientcategory/",
	API_CLIENT_LIST = "/api/v1/cust/listofclientsdata?CompanyBranchId=",
	API_LIST_OF_CLIENT_BY_EMPLOYEE_ID = '/api/v1/Ordering/listofclientsbyemployeeid?Id=',

	//Client Branches
	API_CLIENTBRANCHES_GETBRANCHES = "/api/v1/cust/getclientbranches?",
	API_CLIENTBRANCH_TOGGLE = "/api/v1/cust/changeclientbranchactiveornot/",

	API_CLIENTBRANCHES_ADD = "/api/v1/cust/addclientbranch",
	API_CLIENTBRANCHES_UPLOADIMAGE = "/api/v1/cust/uploadclientbranchesimages",
	API_CLIENTBRANCHES_UPDATE = "/api/v1/cust/updateclientbranch/",
	API_CLIENTBRANCHES_GETALL = "/api/v1/shared/getcompanybranches/",
	API_CLIENTBRANCHES_GETBYID = "/api/v1/cust/getclientbranchprofile?",
	API_ASSIGN_CLIENTBRANCH_TO_PATHROUTE = "/api/v1/cust/assignpathroutetoclientbranch?",
	API_CLIENTBRANCH_PATHROUTE_LOGS = "/api/v1/cust/getclientbranchpathrouteslog?",
	API_CLIENTBRANCH_TO_DEASSIGN_PATHROUTE = "/api/v1/cust/removepathroutefromclientbranch?",
	API_CLIENTBRANCH_GETNOT_ASSIGNEDTO_PATHROUTE = "/api/v1/cust/listofclientsbranchesnotassigned?",
	API_LIST_OF_CLIENT_BRANCH_BY_ID = '/api/v1/cust/listofclientbranches?clientId=',
	API_LIST_OF_CLIENT_BRANCH_BY_EMPLOYEE_ID = '/api/v1/Ordering/listofclientbranchesbyemployeeid?Id=',


	//items and category
	API_GET_ITEMS_CATEGORY = "/api/v1/invt/getinvitemswithchildrentree/",
	API_CATEGORY_List = "/api/v1/invt/listofinvitemscategories/",

	API_CATEGORY_ADD = "/api/v1/invt/addnewinvitemcategory",
	API_CATEGORY_UPDATE = "/api/v1/invt/updateinvitemcategory/",
	API_PARENT_CATEGORY_UPDATE = "/api/v1/invt/changecategoryparentid",
	API_ACTIVE_DEACTIVE_CATEGORY = "/api/v1/invt/changecategoryisactiveornot/",

	API_ITEM_ADD = "/api/v1/invt/addnewinvitems",
	API_GET_ITEM_BY_ID = "/api/v1/invt/getinvitemprofile?itemId=",
	API_GET_ITEM_BY_ID_FOR_ORDER = "/api/v1/invt/getitemprofilebyitemid?",
	API_ITEM_UPDATE = "/api/v1/invt/updateinvitems/",
	API_PARENT_ITEM_UPDATE = "/api/v1/invt/changeitemcategory",
	API_ACTIVE_DEACTIVE_ITEMS = "/api/v1/invt/changeitemisactiveornot/",

	API_LIST_OF_ITEMS = "/api/v1/invt/listofitemsbynameorcode?",
	API_GET_ITEM_PROFILE = "/api/v1/invt/getitemprofilebyid?",



	//Vendor Activity
	API_LIST_OF_ACTIVITY = "/api/v1/Vend/listofactivities?branchId=",
	API_GET_ACTIVITY = "/api/v1/Vend/getactivities?branchId=",
	API_ADD_ACTIVITY = "/api/v1/Vend/addactivity",
	API_UPDATE_ACTIVITY = "/api/v1/Vend/updateactivity/",
	API_DELETE_ACTIVITY = "/api/v1/Vend/deleteactivity/",
	API_ACTIVE_DEACTIVE_VENDOR_ACTIVITY = "",

	//vendor Main Company
	API_LIST_OF_MAIN_COMPANY = "/api/v1/Vend/listofmaincompanies?branchId=",
	API_GET_MAIN_COMPANY = "/api/v1/Vend/getmaincompanies?branchId=",
	API_ADD_MAIN_COMPANY = "/api/v1/Vend/addmaincompany",
	API_UPDATE_MAIN_COMPANY = "/api/v1/Vend/updatemaincompany/",
	API_DELETE_MAIN_COMPANY = "/api/v1/Vend/deletemaincompany/",

	//Vendor Classification
	API_LIST_OF_CLASSIFICATION = "/api/v1/Vend/listofclassifications?branchId=",
	API_GET_CLASSIFICATION = "/api/v1/Vend/getaclassifications?branchId=",
	API_ADD_CLASSIFICATION = "/api/v1/Vend/addclassification",
	API_UPDATE_CLASSIFICATION = "/api/v1/Vend/updateclassification/",
	API_DELETE_CLASSIFICATION = "/api/v1/Vend/deleteclassification/",
	API_ACTIVE_DEACTIVE_VENDOR_CLASSIFICATION = "",

	//Vendor
	API_LIST_OF_VENDOR = "/api/v1/Vend/listofvendors?branchId=",
	API_GET_VENDOR = "/api/v1/Vend/getVendors",
	API_ADD_VENDOR = "/api/v1/Vend/addVendor",
	API_UPDATE_VENDOR = "/api/v1/Vend/updateVendor/",
	API_DELETE_VENDOR = "/api/v1/Vend/deletevendor/",

	//Tax Office

	API_LIST_OF_TAX_OFFICE = '/api/v1/shared/gettaxoffices',

	API_LIST_OF_COMPANY_BRANCH = '/api/v1/shared/listofcompanybranches?companyId=',

	API_GET_TRANSACTION = '/api/v1/invt/getallstocktransactions?',

	API_LIST_OF_TRANSTYPE = '/api/v1/invt/listofstocktranstypes',
	API_LIST_OF_ENTITYTYPE = '/api/v1/invt/listofentitiestypes',
	API_LIST_OF_EXTERNAL_PLACES = '/api/v1/vend/listofexternalplaces?companyId=',

	API_GET_DOCUMENT_NUMBER = '/api/v1/invt/getnextdocumentnumber?',
	API_ADD_TRANSACTION = '/api/v1/invt/addstocktransaction',

	API_GET_ITEM_TRANSACTION = '/api/v1/invt/getallstocktransbyitemid?',
	API_UPDATE_RESERVED = '/api/v1/invt/updatereservedamountforstocktrans',

	API_GET_TRANSFER_TRANSACTION = '/api/v1/invt/getallstocktransactionstransfer?',
	API_GET_ENTITY_TYPE_BY_TRANS_TYPE_ID = '/api/v1/invt/getentitiesperstocktranstype',
	API_UPDATE_ENTITY_TYPE_BY_TRANS_TYPE_ID = '/api/v1/invt/manageentitiesperstocktranstype',
	API_GET_PRICE = '/api/v1/invt/getavgpriceforitem?',


	API_LIST_OF_COMMMITTEE = '/api/v1/Committee/listofcommittee',

	//Riffles
	API_ADD_COUNTING_PROCESS = '/api/v1/invt/addstockcountingprocess',
	API_GET_RIFFLE_BY_ID = '/api/v1/invt/getprofilecountingprocess?CountingProcessId=',
	API_GET_RIFFLE_DATA = '/api/v1/invt/getcountingprocess?',
	API_UPDATE_FINAL_SAVE = '/api/v1/invt/countingprocessfinalsaved?CountingProcessId=',
	API_UPDATE_STTELLEMENT_SAVE = '/api/v1/invt/countingprocesssettlement?CountingProcessId=',

	//Notifications

	API_GET_FCMCONFIG = '/api/v1/notification/getallfcmconf',
	API_POST_ADDFCMCONF = '/api/v1/notification/addfcmconf',
	API_PUT_UPDATEFCMCONF = '/api/v1/notification/updatefcmconf/',
	API_DELETE_DELETEFCMCONF = '/api/v1/notification/deletefcmconf/',

	API_GET_NotiModules = '/api/v1/notification/getallnotimoudles',
	API_POST_ADDNotiModules = '/api/v1/notification/addnoticmoudles',
	API_PUT_UPDATENotiModules = '/api/v1/notification/updatenotimoudles/',
	API_DELETE_DELETENotiModules = '/api/v1/notification/deletenotimoudles/',

	API_GET_NOTIFICATION_BY_USER_ID = '/api/v1/notification/getusermessages?',
	API_LIST_OF_MESSAGE_TYPE = '/api/v1/notification/listofmessagetypes',


	API_GET_LISTOFCOMMITTEEMEMBERS = '/api/v1/Committee/listofcommitteemembers',
	API_GET_GETCOMMITTEEMEMBERS = '/api/v1/Committee/getcommitteemembers',
	API_POST_ADDCOMMITTEEMEMBERS = '/api/v1/Committee/addcommitteemember',
	API_PUT_UPDATECOMMITTEEMEMBERS = '/api/v1/Committee/updatecommitteemember/',
	API_DELETE_COMMITTEEMEMBERS = '/api/v1/Committee/deletecommitteemember/',

	API_GET_LISTOFCOMMITTEETYPES = '/api/v1/Committee/listofcommitteetypes',
	API_POST_ADDCOMMITTEETYPES = '/api/v1/Committee/addcommitteetype',
	API_PUT_UPDATECOMMITTEETYPES = '/api/v1/Committee/updatecommitteetype/',
	API_DELETE_COMMITTEETYPES = '/api/v1/Committee/deletefcommitteetype/',

	API_GET_GETCOMMITTEES = '/api/v1/Committee/getcommittee',
	API_GET_GETCOMMITTEEMEMBERSDETAILS = '/api/v1/Committee/getcommitteemembersdetails',
	API_POST_ADDCOMMITTEE = '/api/v1/Committee/addcommittee',
	API_PUT_UPDATECOMMITTEE = '/api/v1/Committee/updatecommittee/',
	API_DELETE_COMMITTEE = '/api/v1/Committee/deletecommittee/',

	API_GET_STOCKS_BY_TRANS_TYPE_ID = '/api/v1/invt/getstocksperstocktranstype',
	API_UPDATE_STOCKS_TYPE_BY_TRANS_TYPE_ID = '/api/v1/invt/managestocksperstocktranstype',


	//orders
	API_ADD_ORDER = '/api/v1/Ordering/addorder',
	API_GET_ORDERS = '/api/v1/Ordering/getorders?',
	API_GET_STATISTICS_ORDERS = '/api/v1/Ordering/getstatisticsforemployee?',

	//Ordering status
	API_GET_LISTOFORDERSTATUS = '/api/v1/Ordering/listoforderstatus',
	API_GET_GETORDERSTATUS = '/api/v1/Ordering/getallorderstatus',
	API_POST_ADDORDERSTATUS = '/api/v1/Ordering/addorderstatus',
	API_PUT_UPDATEORDERSTATUS = '/api/v1/Ordering/updateorderstatus/',
	API_DELETE_ORDERSTATUS = '/api/v1/Ordering/deleteorderstatus/',

	API_POST_GetEMPLOYEEBYCOMPANYID = '/api/v1/hr/getofallemployeeswithfilter',
	API_GET_GETCLIENTSBYEMPLOYEEID = '/api/v1/Ordering/getclientsbyemployeeid',
	API_POST_MANAGECLIENTSOFEMPLOYEE = '/api/v1/Ordering/manageclientsofemployee',




}
