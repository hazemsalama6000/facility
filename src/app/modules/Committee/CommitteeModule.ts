import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { InlineSVGModule } from "ng-inline-svg-2";
import { SharedModule } from "src/app/shared-module/shared-module.module";
import { TranslationModule } from "../i18n";
import { CommitteeRoutingModule } from "./CommitteeRoutingModule";
import { AddingDialogComponent } from "./Components/CommiteeMembers/Components/AddingDialog/AddingDialog.Component";
import { CommitteeMembersComponent } from "./Components/CommiteeMembers/CommitteeMembers.Component";
import { UpdateDialogComponent } from "./Components/CommiteeMembers/Components/UpdateDialog/UpdateDialog.Component";
import { CommitteeTypeComponent } from "./Components/CommitteeTypes/CommitteeTypes.Component";
import { AddCmtTypeDialogComponent } from "./Components/CommitteeTypes/Components/AddCmtTypeDialog/AddCmtTypeDialog.Component";
import { UpdateCmtTypeDetailsComponent } from "./Components/CommitteeTypes/Components/UpdateCmtTypeDialog/UpdateCmtTypeDialog.Component";
import { CommitteeComponent } from "./Components/Commitee/Committee.Component";
import { AddComtDialogComponent } from "./Components/Commitee/Components/AddDialogComponent/AddDialog.Component";
import { DetailsCmtDialogComponent } from "./Components/Commitee/Components/DetailsCmtDialog/DetailsCmtDialog.component";
import { UpdateCmdDetailsDialogCompoent } from "./Components/Commitee/Components/UpdateDialogCompoent/UpdateCmdDetailsDialog.Compoent";


@NgModule({
    declarations:[
        CommitteeMembersComponent,
        AddingDialogComponent,
        UpdateDialogComponent,
        CommitteeTypeComponent,
        AddCmtTypeDialogComponent,
        UpdateCmtTypeDetailsComponent,
        CommitteeComponent,
        AddComtDialogComponent,
        DetailsCmtDialogComponent,
        UpdateCmdDetailsDialogCompoent
    ],
    imports:[
        CommitteeRoutingModule,
        SharedModule,
        TranslationModule,
        CommonModule,
        InlineSVGModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class CommitteeModule {
    
}