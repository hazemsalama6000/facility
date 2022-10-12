import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DailytransactionsComponent } from "./components/dailytransactions/dailytransactions.component";
import { ReserveditemComponent } from "./components/reserveditem/reserveditem.component";
import { TransactionlistComponent } from "./components/transactionlist/transactionlist.component";
import { TransactionrequestlistComponent } from "./components/transactionrequestlist/transactionrequestlist.component";
import { InventoryTransactionComponent } from "./InventoryTransaction.component";

const routes: Routes = [
	{
		path: '',
		component: InventoryTransactionComponent,
		children: [
			{ path: 'transactionrequest', component: TransactionrequestlistComponent },
			{ path: 'reserveditem', component: ReserveditemComponent },
			{ path: 'transactionList', component: TransactionlistComponent },
			{ path: 'dailytransaction', component: DailytransactionsComponent },
			{ path: '', redirectTo: 'dailytransaction', pathMatch: 'full' },
			{ path: '**', redirectTo: 'dailytransaction', pathMatch: 'full' },
		],
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InventoryTransactionRoutingModule { }
