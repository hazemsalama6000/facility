import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CarExpensesComponent } from "./components/cars-expenses/car-expenses.component";
import { CarsModelsComponent } from "./components/cars-models/cars-models.component";
import { FinancialyearComponent } from "./components/financialyear/financialyear.component";
import { InventorycategoryComponent } from "./components/inventorycategory/inventorycategory.component";
import { PathrouteComponent } from "./components/pathroute/pathroute.component";
import { TransferingCompanyComponent } from "./components/transfering-company/transfering-company.component";

const route: Routes = [
	{ path: 'invcategory', component: InventorycategoryComponent },
	{ path: 'financialyear', component: FinancialyearComponent },
	{ path: 'pathroute', component: PathrouteComponent },
	{ path: 'transferingcompany', component: TransferingCompanyComponent },
	{ path: 'carsmodels', component: CarsModelsComponent },
	{ path: 'carexpenses', component: CarExpensesComponent }
]
@NgModule({
	imports: [RouterModule.forChild(route)],
	exports: [RouterModule]
})
export class DeclarationsRoutingModule { }