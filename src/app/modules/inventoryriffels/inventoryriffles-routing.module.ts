import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RifflesComponent } from "./components/riffles/riffles.component";
import { InventoryriffelsComponent } from "./inventoryriffels.component";

const routes: Routes = [
    {
        path: '',
        component: InventoryriffelsComponent,
        children: [
            { path: 'riffles', component: RifflesComponent }
        ],
    },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) export class InventoryRiffelRoutingModule { }