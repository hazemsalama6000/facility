import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CarExpensesTransactionComponent } from "./components/carexpensetransactions/car-expenses-transactions.component";
import { ManagecarComponent } from "./components/managecar/managecar.component";

const routes: Routes = [
	{ path: 'managecar', component: ManagecarComponent },
	{ path: 'carexpensetransaction', component: CarExpensesTransactionComponent }
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CarRoutingModule { }