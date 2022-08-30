import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"cars-models",
	templateUrl:'./cars-models.component.html',
	styleUrls:['./cars-models.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class CarsModelsComponent 
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