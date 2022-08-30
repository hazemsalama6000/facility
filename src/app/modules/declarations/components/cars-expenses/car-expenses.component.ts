import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"car-expenses",
	templateUrl:'./car-expenses.component.html',
	styleUrls:['./car-expenses.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class CarExpensesComponent 
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