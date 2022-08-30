import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"transferingcompany",
	templateUrl:'./transfering-company.component.html',
	styleUrls:['./transfering-company.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class TransferingCompanyComponent 
{
	
	title:string;
	icon:string;
    model:LookUpModel;

	edit(model:LookUpModel){
          this.model=model;
	}

	StateEmit(model:LookUpModel){
	
	}

}