import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Loader } from "@googlemaps/js-api-loader";
import { google } from "google-maps";
import { Subscription } from "rxjs";
import { ILocationXY } from "src/app/modules/permissions/models/ILocationXY.interface";
import { OnlineUsersService } from "src/app/modules/permissions/services/onlineUsers.service";
import * as _ from "lodash";


declare var google: google;

@Component({
	selector: 'user-location-logs-onmap',
	templateUrl: './user-location-logs-onmap.component.html',
	styleUrls: ['./user-location-logs-onmap.component.scss'],
})

export class UserLocationLogsOnMapComponent implements OnDestroy {
	subscribe: Subscription;
	idInterval: any;

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

	constructor(private service: OnlineUsersService) { }

	ngOnDestroy(): void {
		this.subscribe.unsubscribe();
		if (this.idInterval) {
			clearInterval(this.idInterval);
		}
	}


	private map: google.maps.Map



	ngOnInit(): void {

		let loader = new Loader({
			apiKey: 'AIzaSyBTzs8GbolL8FJKZLWSZVn2xyb1jhoWLeo',
		});

		loader.load().then(() => {

			this.subscribe = this.service.Locations.subscribe(
				(data: ILocationXY[]) => {
					this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
						center: { lat: 31.427593, lng: 31.827810 },
						zoom: 10,
						styles: this.styles
					});

					_.forEach(data, (location: ILocationXY) => {
						
						console.log(location);
						let icon = this.service.checkIconBasedLocation(location.status);
console.log(icon);
						const marker = new google.maps.Marker({
							position: { lat: location.x, lng: location.y },
							map: this.map,
							title: location.empName + "\n" + location.date,
							icon: icon
						});

						if (location.status == true || location.status==false) {
							marker.setAnimation(google.maps.Animation.BOUNCE)
							console.log(location.x + ' ' + location.y)
						}

					});


				});

		});




	}


}