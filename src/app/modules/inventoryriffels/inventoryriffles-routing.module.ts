import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InventorysettlementComponent } from "./components/inventorysettlement/inventorysettlement.component";
import { RifflesComponent } from "./components/riffles/riffles.component";

const routes: Routes = [
    { path: 'riffles', component: RifflesComponent },
    { path: 'inventorysettlement', component: InventorysettlementComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) export class InventoryRiffelRoutingModule { }