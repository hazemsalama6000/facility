import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";


@Injectable({
	providedIn: 'root'
})

export class toasterService {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';

	constructor(private _snackBar: MatSnackBar) { }

	openSuccessSnackBar(message: string) {

		this._snackBar.open(message,'', {
			duration: 3000, horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: 'Success'
		});

	}


	openErrorSnackBar(message: string) {

		this._snackBar.open(message, '', {
			duration: 3000, horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: 'Error'
		});

	}

	openWarningSnackBar(message: string) {

		this._snackBar.open(message,'', {
			duration: 3000, horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: 'Warning'
		});

	}


}