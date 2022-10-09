import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionlistComponent } from "./components/transactionlist/transactionlist.component";
import { InventoryTransactionComponent } from "./InventoryTransaction.component";

const routes: Routes = [
	{
		path: '',
		component: InventoryTransactionComponent,
		children: [
            {path:'transactionList',component:TransactionlistComponent},
			{ path: '', redirectTo: 'transactionList', pathMatch: 'full' },
			{ path: '**', redirectTo: 'transactionList', pathMatch: 'full' },
		],
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InventoryTransactionRoutingModule { }
