import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICustomerEditResponse } from 'src/app/modules/operations/models/cutomer-editmanage/ICustomerEditResponse.interface';

@Component({
	selector: 'app-viewimages',
	templateUrl: './viewimages.component.html',
	styleUrls: ['./viewimages.component.scss']
})
export class ViewimagesForCustomerComponent implements OnInit {
	url: string = localStorage.getItem("companyLink") as string;
	images: string[] = [];
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		this.images.push(data.imagePath);
	}

	ngOnInit() {
		// console.log(this.data)
	}

}
