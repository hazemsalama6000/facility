import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LookupIdNameComponent } from "src/app/shared-module/Components/lookupId_name/lookupId_name.component";
import { CarExpensesComponent } from "./components/cars-expenses/car-expenses.component";
import { CarsModelsComponent } from "./components/cars-models/cars-models.component";
import { FinancialyearComponent } from "./components/financialyear/financialyear.component";
import { InternaldivisionstockComponent } from "./components/Internaldivisionstock/Internaldivisionstock.component";
import { InventoryComponent } from "./components/inventory/inventory.component";
import { InventorycategoryComponent } from "./components/inventorycategory/inventorycategory.component";
import { PathrouteComponent } from "./components/pathroute/pathroute.component";
import { TransferingCompanyComponent } from "./components/transfering-company/transfering-company.component";
import { VoucherSerialsComponent } from "./components/voucher-serials/voucher-serials.component";

const route: Routes = [
	{ path: 'invcategory', component: InventorycategoryComponent },
	{ path: 'inventory', component: InventoryComponent },
	{ path: 'internaldivision', component: InternaldivisionstockComponent },
	{ path: 'financialyear', component: FinancialyearComponent },
	{ path: 'pathroute', component: PathrouteComponent },
	{ path: 'transferingcompany', component: TransferingCompanyComponent },
	{ path: 'carsmodels', component: CarsModelsComponent },
	{ path: 'carexpenses', component: CarExpensesComponent },
	{ path: 'voucherSerial', component: VoucherSerialsComponent },
	{ path: 'clientcategory', component: LookupIdNameComponent, data: { page: 'CLIENT_CATEGORY' } },
	
]
@NgModule({
	imports: [RouterModule.forChild(route)],
	exports: [RouterModule]
})
export class DeclarationsRoutingModule { }