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
  selector: 'app-recent-sold-items',
  templateUrl: './recent-sold-items.component.html',
  styleUrls: ['./recent-sold-items.component.css']
})
export class RecentSoldItemsComponent implements OnInit {

  items: ItemDetails[];
  closeResult: string;
  modalReference = null;

  

  constructor(private itemService: ItemService, private modalService: NgbModal, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.itemBind(0);
  }

  itemBind(recentTime) {
    // getting all rides and fill
    if (recentTime == 5) {
      this.itemService.getAllRecentSoldOutItems(localStorage.getItem('currentUser'))
        .subscribe(itemdata => {
          if (itemdata.length>0) {
            debugger
            this.items = itemdata
            console.log("All history items: " + this.items);
          }
        }, err => {
          console.log('Something went wrong!');
        }
        );  //saveItem ends
    }
    else
    {
      this.itemService.getAllUserItems(localStorage.getItem('currentUser'))
      .subscribe(itemdata => {
        if (itemdata.length>0) {
          debugger
          this.items = itemdata
          console.log("All items: " + this.items);
        }
        else
        {
          this.items=null;
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
    }
  }
}
