import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { EmployeeService } from "../../services/employee.service";

@Component({
	selector: "branchs-c",
	templateUrl: './branch.component.html',
	styleUrls: ['./branch.component.scss']
})

export class BranchComponent implements OnInit{
	
	panelOpenState:boolean = false;

	title: string;
	icon: string;
	model: LookUpModel;

	@Input() companyId : number;

	constructor(private employeeService : EmployeeService){

	}
	
	ngOnInit(): void {
		this.employeeService.getLookupEmployeeData(this.companyId).subscribe(
			(data: LookUpModel[]) => {
				this.employeeService.employees = data;
				
			}
		);
	}

}