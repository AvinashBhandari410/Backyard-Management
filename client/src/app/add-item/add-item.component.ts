/// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
  @ViewChild('fileInput') fileInput: ElementRef;
  itemForm: FormGroup;
  itemSuccess: boolean;
  item: Item;
  selectedFile: File = null;
  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, private scriptloader: ScriptService, private http: HttpClient) { }

  ngOnInit() {
    // updateOn default is change other option is blur or submit
    this.itemForm = this.fb.group({
      item_name: ['', { updateOn: 'blur' }, Validators.required],
      item_description: ['', { updateOn: 'blur' }, Validators.required],
      item_image: ['', { updateOn: 'blur' }, Validators.required],
      item_cost: ['', { updateOn: 'blur' }, Validators.required],
      item_Location: ['', { updateOn: 'blur' }, Validators.required],
      isItem_Available: ['', { updateOn: 'blur' }, Validators.required]
    });
  }

  // onFileSelected(event) {
  //   this.selectedFile = <File> event.target.files[0];
  //   //    console.log(event);
  // }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      // let file = event.target.files[0];
      // this.itemForm.get('item_image').setValue(file);
    }
    // debugger
    // let reader = new FileReader();
    // if(event.target.files && event.target.files.length > 0) {
    //   let file = event.target.files[0];
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.itemForm.get('item_image').setValue({
    //       filename: file.name,
    //       filetype: file.type,
    //       value: reader.result.toString().split(',')[1]
    //     })
    //   };
    // }
  }

  private prepareSave(): any {
    // let input = new FormData();
    // const item = {
    //   item_Name: this.itemForm.value.item_Name,
    //   item_description: this.itemForm.value.item_description,
    //   item_image: this.itemForm.value.item_image,
    //   item_cost: this.itemForm.value.item_cost,
    //   item_Location: this.pickUpAuto.nativeElement.value
    // }
    // input.append('item_Name', item.item_Name);
    // input.append('item_description', item.item_description);
    // input.append('item_image', item.item_image);
    // input.append('item_cost', item.item_cost);
    // input.append('item_Location', item.item_Location);
    // debugger

    let input = new FormData();
    input.append('item_name', this.itemForm.get('item_name').value);
    input.append('item_description', this.itemForm.get('item_description').value);
    input.append('item_image', this.itemForm.get('item_image').value);
    input.append('item_cost', this.itemForm.get('item_cost').value);
    input.append('item_Location', this.pickUpAuto.nativeElement.value);

    return input;
  }

  addItem(): void {
    // const formModel = this.prepareSave();
   
    // const item = {
    //   item_Name: this.itemForm.value.full_name,
    //   item_description: this.itemForm.value.email_address,
    //   item_image: this.itemForm.value.address,
    //   item_cost: this.itemForm.value.phone_number,
    //   item_Location: this.pickUpAuto.nativeElement.value
    // }

    // debugger
    // const fd=new FormData();
    // fd.append('item_image', this.selectedFile);
    // console.log(fd)
     this.itemForm.value.item_Location = this.pickUpAuto.nativeElement.value;
    // this.itemForm.value.item_image=fd;
     debugger
    this.itemService.addItem(this.itemForm.value)
      .subscribe(itemData => {
        debugger
        if (itemData != null) {
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
    }).catch(error => console.log(error));
  } // ngAfterViewInit ends
}
