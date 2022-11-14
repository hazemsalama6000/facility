import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SuperVisorOrderingComponent } from "./components/superVisorOrdering/superVisorOrdering.component";


const routes: Routes = [
    { path: 'supervisorordering', component: SuperVisorOrderingComponent },
    { path: '**', redirectTo: '/supervisorordering' },
    { path: '', redirectTo: '/supervisorordering' }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryOrderingRoutingModule { }