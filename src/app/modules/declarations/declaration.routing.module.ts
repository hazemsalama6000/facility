import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinancialyearComponent } from "./components/financialyear/financialyear.component";
import { InventorycategoryComponent } from "./components/inventorycategory/inventorycategory.component";
import { PathrouteComponent } from "./components/pathroute/pathroute.component";

const route: Routes = [
    { path: 'financialyear', component: FinancialyearComponent },
    { path: 'pathroute', component: PathrouteComponent },
    {path:'invcategory',component:InventorycategoryComponent}
]
@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})
export class DeclarationsRoutingModule { }