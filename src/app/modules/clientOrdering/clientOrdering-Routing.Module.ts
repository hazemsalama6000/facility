import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientOrderingComponent } from "./clientOrdering.component";
import { OrderStatusComponent } from "./components/orderStatus/OrderStatus.Component";

const routes: Routes = [
    { path: 'orders', component: ClientOrderingComponent },
    { path: 'orderstatus', component: OrderStatusComponent },
    { path: '**', redirectTo: '/orders' },
    { path: '', redirectTo: '/orders' }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule] 
})
export class clientOrderingRoutingModule { }