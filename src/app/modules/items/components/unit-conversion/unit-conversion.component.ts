import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector:"unit-conversion",
	templateUrl:'./unit-conversion.component.html',
	styleUrls:['./unit-conversion.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush
})

export class UnitConversionComponent 
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