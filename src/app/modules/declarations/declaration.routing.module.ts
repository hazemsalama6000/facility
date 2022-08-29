import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinancialyearComponent } from "./components/financialyear/financialyear.component";
import { PathrouteComponent } from "./components/pathroute/pathroute.component";
import { TransferingCompanyComponent } from "./components/transfering-company/transfering-company.component";

const route: Routes = [
	{ path: 'financialyear', component: FinancialyearComponent },
	{ path: 'pathroute', component: PathrouteComponent },
	{ path: 'transferingcompany', component: TransferingCompanyComponent }
]
@NgModule({
	imports: [RouterModule.forChild(route)],
	exports: [RouterModule]
})
export class DeclarationsRoutingModule { }