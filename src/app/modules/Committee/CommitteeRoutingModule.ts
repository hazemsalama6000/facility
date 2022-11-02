import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommitteeComponent } from "./Components/Commitee/Committee.Component";
import { CommitteeMembersComponent } from "./Components/CommiteeMembers/CommitteeMembers.Component";
import { CommitteeTypeComponent } from "./Components/CommitteeTypes/CommitteeTypes.Component";

const routes: Routes = [
    { path: 'CommitteeMembers', component: CommitteeMembersComponent },
    { path: 'CommitteeTypes', component: CommitteeTypeComponent },
    { path: 'Committee' , component:CommitteeComponent},
    { path: '**' , component:CommitteeComponent},
    { path: '' , component:CommitteeComponent}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CommitteeRoutingModule {
    
}