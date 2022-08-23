import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Loader } from "@googlemaps/js-api-loader";
import { google } from "google-maps";
import { Subscription } from "rxjs";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { ILocationXY } from "src/app/modules/permissions/models/ILocationXY.interface";
import { OnlineUsersService } from "src/app/modules/permissions/services/onlineUsers.service";

declare var google: google;

@Component({
	selector: 'user-location',
	templateUrl: './user-location.component.html',
	styleUrls: ['./user-location.component.scss'],
})

export class UserLocationComponent implements OnDestroy {
	subscribe: Subscription;
	idInterval: any;
	employeeId: number;

	styles = [
		{
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#ebe3cd"
				}
			]
		},
		{
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#523735"
				}
			]
		},
		{
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#f5f1e6"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#c9b2a6"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#dcd2be"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#ae9e90"
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dfd2ae"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dfd2ae"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#93817c"
				}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#a5b076"
				}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#447530"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#f5f1e6"
				}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#fdfcf8"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#f8c967"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#e9bc62"
				}
			]
		},
		{
			"featureType": "road.highway.controlled_access",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#e98d58"
				}
			]
		},
		{
			"featureType": "road.highway.controlled_access",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#db8555"
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#806b63"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dfd2ae"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#8f7d77"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#ebe3cd"
				}
			]
		},
		{
			"featureType": "transit.station",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dfd2ae"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#b9d3c2"
				},
				{
					"saturation": 25
				},
				{
					"weight": 3.5
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#14fbff"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#92998d"
				}
			]
		}
	];

	message = "";

	constructor(private route: ActivatedRoute, private service: OnlineUsersService, private toaster: toasterService) {
		this.route.paramMap.subscribe((data: ParamMap) => {
			this.employeeId = +data.get('employeeId')!;
			// console.log(this.employeeId);
		});
	}


	private map: google.maps.Map


	ngOnInit(): void {


		let loader = new Loader({
			apiKey: 'AIzaSyBTzs8GbolL8FJKZLWSZVn2xyb1jhoWLeo',
		});

		loader.load().then(() => {
			this.InitializeMap();
		});

		loader.load().then(() => {

			this.idInterval = setInterval(() => {

				this.InitializeMap();

			}, 20000);

		});

	}

	InitializeMap() {
		this.subscribe = this.service.getOnlineUsersCurrentLocationData(this.employeeId).subscribe((data: ILocationXY[]) => {
			this.message = "";
			console.log(data.length);
			if (data.length < 1) {
				this.message = "لايوجد بيانات";
			}
			else {
				let location = { lat: data[0].x, lng: data[0].y }
				this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
					center: location,
					zoom: 10,
					styles: this.styles
				});

				const marker = new google.maps.Marker({
					position: location,
					map: this.map,
					title: data[0].empName + "\n" + data[0].date
				});
			}

		},(err)=>{
			this.toaster.openWarningSnackBar("لايوجد مواقع");
			if (this.subscribe) {
				this.subscribe.unsubscribe();
				if (this.idInterval) {
					clearInterval(this.idInterval);
				}
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
			if (this.idInterval) {
				clearInterval(this.idInterval);
			}
		}
	}


}