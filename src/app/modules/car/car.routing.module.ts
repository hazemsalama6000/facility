import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManagecarComponent } from "./components/managecar/managecar.component";

const routes: Routes = [
    { path: 'managecar', component: ManagecarComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarRoutingModule { }