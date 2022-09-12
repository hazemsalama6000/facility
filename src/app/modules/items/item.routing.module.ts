import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemsAndCategoryComponent } from "./components/itemsAndCategory/itemsAndCategory.component";
import { UnitConversionComponent } from "./components/unit-conversion/unit-conversion.component";

const routes: Routes = [
	{ path: 'unitconversion', component: UnitConversionComponent },
	{ path: 'itemcategory', component: ItemsAndCategoryComponent },
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ItemRoutingModule { }