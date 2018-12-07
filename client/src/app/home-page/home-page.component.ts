/// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, ItemDetails } from '../_models/item.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScriptService } from '../shared/script.service'
import { forEach } from '@angular/router/src/utils/collection';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ImageZoomModule } from 'angular2-image-zoom';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  @ViewChild('map-canvas') mapRouteDirection: ElementRef;
  items: ItemDetails[]
  isodd = false;
  isUserLogin: boolean = false;
  loggedInUserId: string = "";
  curLocLat: number;
  curLncLng: number;
  closeResult: string;

  public get changeOdd() {
    this.isodd = !this.isodd;

    return this.isodd;
  }

  ngAfterViewInit() {
    //debugger
    // this.scriptloader.load('googlemaps').then(data => {
    //   var directionsService = new google.maps.DirectionsService();
    //   var directionsDisplay = new google.maps.DirectionsRenderer();
    //   //  var mapRef=this.mapRouteDirection.nativeElement;
    //   var chicago = new google.maps.LatLng(37.334818, -121.884886);
    //   var mapOptions = {
    //     zoom: 10,
    //     center: chicago
    //   };
    //   var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //   directionsDisplay.setMap(map);
    //   //google.maps.event.addDomListener(document.getElementById('	'), 'click', calcRoute);

    //   var start = new google.maps.LatLng(37.334818, -121.884886);
    //   var end = new google.maps.LatLng(38.762791, -93.736053);

    //   var bounds = new google.maps.LatLngBounds();
    //   bounds.extend(start);
    //   bounds.extend(end);
    //   map.fitBounds(bounds);
    //   var request = {
    //     origin: start,
    //     destination: end,
    //     travelMode: google.maps.TravelMode.DRIVING
    //   };
    //   directionsService.route(request, function (response, status) {
    //     if (status == google.maps.DirectionsStatus.OK) {
    //       directionsDisplay.setDirections(response);
    //       console.log("Response:" + response);
    //       directionsDisplay.setMap(map);
    //       console.log("Map: " + map);
    //     } else {
    //       alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
    //     }
    //   });
    // }).catch(error => console.log(error));

    // debugger;
    this.scriptloader.load('googlemaps', 'googledistance').then(data => {
      // debugger
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          //   debugger
          this.curLocLat = pos.lat;
          this.curLncLng = pos.lng;
          // var google_map_pos = new google.maps.LatLng( pos.lat, pos.lng );

          //  /* Use Geocoder to get address */
          //  var google_maps_geocoder = new google.maps.Geocoder();
          //  google_maps_geocoder.geocode(
          //      { 'location' : google_map_pos },
          //      function( results, status ) {

          //          if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
          //              console.log( results[0].formatted_address );
          //              this.userCurrentLocation=results[0].formatted_address;
          //          }  
          //      }
          //  );

          // console.log(pos);

          this.itemBind();
        }.bind(this));
      }
    }).catch(error => console.log(error));
    // this.scriptloader.load('googledistance').then(data => {
    //   this.itemBind();
    // }).catch(error => console.log(error));
    if (localStorage.getItem('currentUser') != null && localStorage.getItem('currentUser') != '') {
      this.isUserLogin = true;
      this.loggedInUserId = localStorage.getItem('currentUser');
    }
  }
  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, private scriptloader: ScriptService, private modalService: NgbModal) { }

  ngOnInit() {

  }

  filterItemsDistanceWise(){

  }



  response_data(responseDis, status) {
    console.log('status',status);
    if (status !== google.maps.DistanceMatrixStatus.OK || status != "OK") {
      console.log('Error:', status);
    } else {
      console.log('responseDis', responseDis);

      var origins = responseDis.originAddresses;
      var destinations = responseDis.destinationAddresses;
      // https://developers.google.com/maps/documentation/javascript/distancematrix
      for (var i = 0; i < origins.length; i++) {
        var results = responseDis.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var onlyMiles=distance.split(' ')[0];

          this.items[j].distanceFromCurLoc=parseFloat(onlyMiles);
          // items sequence // same seq google return value or not.
        }
      }
      console.log('this.items',this.items);

    }
  }


  itemBind() {

    if (localStorage.getItem("currentUser") === null) {
      // getting all items and fill
      this.itemService.getAllHomeItems(this.items)
        .subscribe(itemdata => {
          if (itemdata) {
            //   debugger
            this.items = itemdata
            console.log("All homes items: ", this.items);



            var origin: google.maps.LatLng = new google.maps.LatLng(this.curLocLat, this.curLncLng);
            var destinations: any[] = [];

            this.items.forEach(item => {
              let newLoc = new google.maps.LatLng(item._id.latitude, item._id.longitude);
              destinations.push(newLoc);


            });
            console.log('destinations', destinations);


            // origin[] and destination[] 
            // you got lat and longi from db.
            // origin // current
            // foreach Database data. take longi and lati from that.
            // add those new google.maps.LatLng(55.930385, -3.118425)

            // here u will get the array of multiple destinations ryt?

            // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
            // var destinationA = new google.maps.LatLng(50.087692, 14.421150);
            // var destinationB = new google.maps.LatLng(50.087692, 14.421150);

            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin], // origin pass
                destinations: destinations, // array of destination.
                unitSystem: google.maps.UnitSystem.IMPERIAL, //miles
                durationInTraffic: true,
                avoidHighways: false,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: false
              }, this.response_data.bind(this));
          }
        }, err => {
          console.log('Something went wrong!');
        }
        );  //saveItem ends
    }
    else {
      // getting all rides and fill
      this.itemService.getAllLogInUserHomeItems(localStorage.getItem('currentUser'))
        .subscribe(itemdata => {
          if (itemdata) {

            //   debugger
            this.items = itemdata
            console.log("All homes items: ", this.items);



            var origin: google.maps.LatLng = new google.maps.LatLng(this.curLocLat, this.curLncLng);
            var destinations: any[] = [];

            this.items.forEach(item => {
              let newLoc = new google.maps.LatLng(item._id.latitude, item._id.longitude);
              destinations.push(newLoc);


            });
            console.log('destinations', destinations);


            // origin[] and destination[] 
            // you got lat and longi from db.
            // origin // current
            // foreach Database data. take longi and lati from that.
            // add those new google.maps.LatLng(55.930385, -3.118425)

            // here u will get the array of multiple destinations ryt?

            // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
            // var destinationA = new google.maps.LatLng(50.087692, 14.421150);
            // var destinationB = new google.maps.LatLng(50.087692, 14.421150);

            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin], // origin pass
                destinations: destinations, // array of destination.
                unitSystem: google.maps.UnitSystem.IMPERIAL, //miles
                durationInTraffic: true,
                avoidHighways: false,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: false
              }, this.response_data.bind(this));
            // //  debugger
            // this.items = itemdata
            // console.log("All home items for loggin users: " + this.items);
          }
        }, err => {
          console.log('Something went wrong!');
        }
        );  //saveItem ends
    } //else ends
  } // method ends

  updateUserItemInterest(itemInterestId: string, isUserInterested: boolean) {

    this.itemService.updateUserItemInterest(itemInterestId, isUserInterested)
      .subscribe(itemData => {
        //debugger
        if (itemData != null) {
          this.itemBind();
        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }

  deleteUserItemInterest(itemInterestId: string) {
    // debugger
    this.itemService.deleteUserItemInterest(itemInterestId)
      .subscribe(itemData => {
        //  debugger
        if (itemData != null) {
          this.itemBind();
        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }




  addUserItemInterest(itemId: string, isUserInterested: boolean) {
    //  debugger
    this.itemService.addUserItemInterest(itemId, isUserInterested)
      .subscribe(itemData => {
        //debugger
        if (itemData != null) {
          this.itemBind();
        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }


  requestForItem(itemId: string) {

    this.itemService.updateUserItemInterest(itemId, true)
      .subscribe(itemData => {
        debugger
        if (itemData != null) {

        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }

  ShowItemDetails(itemID, itemLng, itemLong) {
    debugger;
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    //  var mapRef=this.mapRouteDirection.nativeElement;
    var chicago = new google.maps.LatLng(this.curLocLat, this.curLncLng);
    var mapOptions = {
      zoom: 0,
      draggable: true,
      center: chicago
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    //google.maps.event.addDomListener(document.getElementById('	'), 'click', calcRoute);

    // //set current location latitude and logitude
    var start = new google.maps.LatLng(this.curLocLat, this.curLncLng);

    // //set Item added location latitude and logitude
    // var end = new google.maps.LatLng(itemLng, itemLong);


    //var start = new google.maps.LatLng(37.355472, -121.997757);
    //var end = new google.maps.LatLng(38.334818, -181.884886);
    var end = new google.maps.LatLng(itemLng, itemLong);

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
      debugger
      console.log("Status: " + status);
      debugger
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        console.log("Response:" + response);
        directionsDisplay.setMap(map);
        console.log("Map: " + map);
      } else {
        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    });
  }

  // modal pop up open starts
  open(content) {
    debugger
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      debugger
      this.closeResult = 'Closed with: ${result}';
      console.log('save button')
    }, (reason) => {

      console.log("Reason:" + reason);
      this.closeResult = 'Dismissed ${this.getDismissReason(' + reason + ')}';

    });
  } // modal pop up open ends

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // isItemIntersted(itemId: string) {

  //   for (var i = 0; i < this.items.length; i++) {
  //     debugger
  //     if (this.items[i].itemInterest != null && this.items[i].itemInterest.length > 0) {
  //       for (var j = 0; j < this.items[i].itemInterest.length; j++) {
  //         if (this.items[i].itemInterest[j].itemId === itemId && this.items[i].itemInterest[j].userId === localStorage.getItem('currentUser')) {
  //           //return true;
  //         }
  //         else {
  //           //return false;
  //         }
  //       }
  //         return true;
  //     }
  //     else {
  //     //  return false;
  //     }
  //   }
  // var ItemDetails = this.items.filter(
  //   itemObj => itemObj.itemInterest != null && itemObj.itemInterest.length > 0 ? itemObj.itemInterest.filter(itemInterestedData =>
  //     itemInterestedData.itemId === itemId && itemInterestedData.userId === localStorage.getItem('currentUser')) : [{}]);

  // //itemObj.itemInterest!=null && itemObj.itemInterest[0].itemId === itemId && itemObj.itemInterest[0].userId  === localStorage.getItem('currentUser'));
  // debugger
  // if (ItemDetails.length > 0) {
  //   if (ItemDetails[0].itemInterest[0].isItemInterested)
  //     return true;
  //   else
  //     return false;
  // }
  // else
  //   return false;
  //     if(localStorage.getItem('currentUser')!=null && localStorage.getItem('currentUser')!='')
  // {
  //   this.isUserLogin=true;
  // }
  //}
}
