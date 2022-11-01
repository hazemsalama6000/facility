import { Routes } from '@angular/router';

const Routing: Routes = [
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
	},
	{
		path: 'hr',
		loadChildren: () =>
			import('../modules/hr/hr.module').then((m) => m.HrModule)
	},
	{
		path: 'client',
		loadChildren: () =>
			import('../modules/client/client.module').then((m) => m.ClientModule)
	},
	{
		path: 'employee',
		loadChildren: () =>
			import('../modules/employees/employees.module').then((m) => m.EmployeesModule)
	},
	{
		path: 'customer',
		loadChildren: () =>
			import('../modules/customers/cutomers.module').then((m) => m.CustomerModule)
	},
	{
		path: 'permissions',
		loadChildren: () =>
			import('../modules/permissions/permissions.module').then(m => m.PermissionsModule)
	},
	{
		path: 'declarations',
		loadChildren: () =>
			import('../modules/declarations/declarations.module').then(m => m.DeclarationsModule)
	},
	{
		path: 'car',
		loadChildren: () =>
			import('../modules/car/car.module').then(m => m.CarModule)
	},
	{
		path: 'vendor',
		loadChildren: () =>
			import('../modules/vendor/vendor.module').then(m => m.VendorModule)
	},
	{
		path: 'InvTransaction',
		loadChildren: () =>
			import('../modules/InventoryTransaction/InventoryTransaction.module').then(m => m.InventoryTransactionModule)
	},
	{
		path: 'InvRiffels',
		loadChildren: () =>
			import('../modules/inventoryriffels/inventoryriffels.module').then(m => m.InventoryriffelsModule)
	},
	{
		path: 'items',
		loadChildren: () => import('../modules/items/item.module').then(m => m.ItemModule)
	},
	{
		path: 'operation',
		loadChildren: () =>
			import('../modules/operations/operations.module').then(m => m.OperationsModule)
	},	
	{
		path: 'notifications',
		loadChildren: () =>
			import('../modules/notification/notification.module').then((m) => m.NotificationModule)
	},
	{
		path: 'share',
		loadChildren: () =>
			import('../modules/share/share.module').then((m) => m.shareModule)
	},
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: 'error/404',
	},
];

export { Routing };
