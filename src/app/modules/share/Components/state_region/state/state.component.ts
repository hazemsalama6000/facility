import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"state",
	templateUrl:'./state.component.html',
	styleUrls:['./state.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class StateComponent 
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