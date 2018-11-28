  /// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { ScriptService } from '../shared/script.service'

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent implements OnInit, AfterViewInit  {
  @ViewChild('map-canvas') mapRouteDirection: ElementRef;

  constructor(private scriptloader: ScriptService
  ) { }

  ngAfterViewInit() {

    this.scriptloader.load('googlemaps').then(data => {
      var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    //  var mapRef=this.mapRouteDirection.nativeElement;
        var chicago = new google.maps.LatLng(37.334818, -121.884886);
        var mapOptions = {
            zoom: 10,
            center: chicago
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        //google.maps.event.addDomListener(document.getElementById('	'), 'click', calcRoute);
  
        var start = new google.maps.LatLng(37.334818, -121.884886);
        //var end = new google.maps.LatLng(38.334818, -181.884886);
        var end = new google.maps.LatLng(38.762791, -93.736053);
  
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            console.log("Response:" + response);
            directionsDisplay.setMap(map);
            console.log("Map: "+ map);
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
    })//.catch(error => console.log(error));

    // debugger;
    
  }
  
  ngOnInit() {
  }
}
