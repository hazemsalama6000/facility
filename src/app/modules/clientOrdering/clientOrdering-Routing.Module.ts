import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientOrderingComponent } from "./clientOrdering.component";

const routes: Routes = [
     { path: 'orders', component: ClientOrderingComponent },
     { path: '**' , redirectTo:'/orders'},
     { path: '' , redirectTo:'/orders'}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class clientOrderingRoutingModule { }