import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IComplain, IComplainList } from '../../../models/IComplain.interface';

@Component({
  selector: 'app-viewimages',
  templateUrl: './viewimages.component.html',
  styleUrls: ['./viewimages.component.scss']
})
export class ViewimagesComponent implements OnInit {
url:string=localStorage.getItem("companyLink") as string;
images:string[]=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { complain: IComplainList }) {
    this.images=data.complain.complaintImagesPath
   }

  ngOnInit() {
    // console.log(this.data)
  }

}
