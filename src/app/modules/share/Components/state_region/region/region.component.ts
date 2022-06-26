import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IRegion } from "../../../models/IRegion.interface";

@Component({
	selector:"region",
	templateUrl:'./region.component.html',
	styleUrls:['./region.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush

})

export class RegionComponent 
{
	
	title:string;
	icon:string;
    model:IRegion;

	edit(model:IRegion){
          this.model = model;
	}

}