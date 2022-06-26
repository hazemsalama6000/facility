import { Component, OnInit } from "@angular/core";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IRegion } from "../../../models/IRegion.interface";
import { ISection } from "../../../models/ISection.interface";

@Component({
	selector:"section-c",
	templateUrl:'./section.component.html',
	styleUrls:['./section.component.scss']
})

export class SectionComponent 
{
	
	title:string;
	icon:string;
    model:ISection;

	edit(model:ISection){
          this.model = model;
	}

}