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
  selector: 'app-item-request',
  templateUrl: './item-request.component.html',
  styleUrls: ['./item-request.component.css']
})
export class ItemRequestComponent implements OnInit {

  items: ItemDetails[];
  closeResult: string;
  modalReference = null;   

  constructor(private itemService: ItemService, private modalService: NgbModal, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.itemBind();
  }

  itemBind() {
    // getting all rides and fill
    this.itemService.getAllUserItemHistory(localStorage.getItem('currentUser'))
      .subscribe(itemdata => {
        if (itemdata) {
            debugger
          this.items = itemdata
          console.log("All history items: " + this.items);
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
  }

  updateStatus(_itemId: string, isItemSoldout: boolean): void {
    debugger
    this.itemService.updateItemSoldOut(_itemId, isItemSoldout)
      .subscribe(itemdata => {
        if (itemdata) {
          this.itemBind();
        }
      }, (err) => {
        console.log(err);
      }
      );
  }

}
