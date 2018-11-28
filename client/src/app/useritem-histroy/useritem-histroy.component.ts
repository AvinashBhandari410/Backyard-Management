import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, ItemDetails } from '../_models/item.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScriptService } from '../shared/script.service'
import { forEach } from '@angular/router/src/utils/collection';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-useritem-histroy',
  templateUrl: './useritem-histroy.component.html',
  styleUrls: ['./useritem-histroy.component.css']
})
export class UseritemHistroyComponent implements OnInit {
  items: ItemDetails[];
  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemBind();
  }

  itemBind() {
    // getting all rides and fill
    this.itemService.getAllUserItemHistory(localStorage.getItem('currentUser'))
      .subscribe(itemdata => {
        debugger
        if (itemdata) {
        //  debugger
          this.items = itemdata
          console.log("All history items: " + this.items);
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
  }
}
