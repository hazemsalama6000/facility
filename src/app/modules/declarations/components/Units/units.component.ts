import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"units",
	templateUrl:'./units.component.html',
	styleUrls:['./units.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class UnitsComponent 
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