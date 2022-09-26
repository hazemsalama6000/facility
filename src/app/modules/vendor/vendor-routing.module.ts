import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { VendorComponent } from "./components/vendor/vendor.component";
import { VendoractivityComponent } from "./components/vendoractivity/vendoractivity.component";
import { VendorclassificationComponent } from "./components/vendorclassification/vendorclassification.component";
import { VendormaincompanyComponent } from "./components/vendormaincompany/vendormaincompany.component";

const routes: Route[] = [
    {path:'vendorlist',component:VendorComponent},
    {path:'activity',component:VendoractivityComponent},
    {path:'classification',component:VendorclassificationComponent},
    {path:'maincompany',component:VendormaincompanyComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) export class VendorRoutingModule { }