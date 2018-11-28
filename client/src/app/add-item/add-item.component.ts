/// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ScriptService } from '../shared/script.service'
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item } from '../_models/item.model';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit, AfterViewInit {
  @ViewChild('pickUpAuto') pickUpAuto: ElementRef;
  //@ViewChild('fileInput') fileInput: ElementRef;
  itemForm: FormGroup;
  files: FileList;

  itemSuccess: boolean;
  item: Item;
  selectedFile: File = null;
  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, private scriptloader: ScriptService, private http: HttpClient
    , private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // updateOn default is change other option is blur or submit
    this.itemForm = this.fb.group({
      item_name: ['', Validators.compose([
        Validators.required,
      ])],
      item_description: ['', Validators.compose([
        Validators.required,
      ])],
      item_image: ['', Validators.compose([
        Validators.required,
      ])],
      item_cost: ['', Validators.compose([
        Validators.required,
      ])],
      item_Location: ['', Validators.compose([
        Validators.required,
      ])],
      isItem_Available: [''],
      longitude: [''],
      latitude: [''],
    });
  }

  // func to check 
  // https://medium.com/@amcdnl/file-uploads-with-angular-reactive-forms-960fd0b34cb5
  // Thanks Austin for ChangeDetection.
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {

      this.files = event.target.files;

      reader.readAsDataURL(this.files[0]);

      reader.onload = () => {
        this.itemForm.patchValue({
        });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  } //func to check files ends

  async addItem(){

    this.itemForm.value.item_Location = this.pickUpAuto.nativeElement.value;

    //get and set the longitude and lattitude
    const value = <any>await this.scriptloader.geocodeAddress(this.itemForm.value.item_Location);
    this.itemForm.value.latitude=value[0];
    this.itemForm.value.longitude=value[1];
    console.log("LatLng" + value);
    this.itemService.addItem(this.files, this.itemForm.value)
      .subscribe(itemData => {
        if (itemData != null) {

          let mailContent = {
            from_email_address: "avinash.bhandari24@gmail.com",
            to_email_address: "avinashbhandari@outlook.com",
            subject: "Backyard Management: New item approval request",
            mailbody: "Hello Admin, <br/> Please approve below item request Item Name: " + itemData.item_name + "Please click here for approval" + "localhost:4200/login"
          }
          this.itemService.sendMail(mailContent);

          this.itemSuccess = true
          this.item = itemData;
          //localStorage.setItem('currentUser', this.item._id);
        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }

  // ngAfterViewInit starts
  ngAfterViewInit() {

    this.scriptloader.load('googlemaps').then(data => {
      
      var pickUpAuto = new google.maps.places.Autocomplete(this.pickUpAuto.nativeElement);
      // Set the data fields to return when the user selects a place.
      pickUpAuto.setComponentRestrictions(
        { 'country': ['us'] });
      //pickUpAuto.setTypes(['(regions)'])
      //pickUpAuto.setTypes(['cities'])

      // Supporting google maps types
      //https://developers.google.com/places/web-service/supported_types

      pickUpAuto.setTypes(['address'])
      // this.geocodeAddress("Sanjon Road, Ventura, CA, USA");
    }).catch(error => console.log(error));
  } // ngAfterViewInit ends



}

//Get latitude and longitude based upon the physical address
//https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding
//https://developers.google.com/maps/documentation/geocoding/intro