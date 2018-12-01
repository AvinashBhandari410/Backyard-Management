import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, ItemDetails } from '../_models/item.model';

@Component({
  selector: 'app-item-mangement',
  templateUrl: './item-mangement.component.html',
  styleUrls: ['./item-mangement.component.css']
})
export class ItemMangementComponent implements OnInit {

  items: ItemDetails[]
  isodd = false;

  public get changeOdd() {
    this.isodd = !this.isodd;
    return true;
  }

  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.itemBind();
  }

  itemBind() {
    // getting all rides and fill
    this.itemService.getAllItems(localStorage.getItem('currentUser'))
      .subscribe(itemdata => {
        if (itemdata) {
          //debugger
          this.items = itemdata
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
  }

  updateStatus(_itemId: string, currentStatus: boolean): void {
    this.itemService.updateItem(_itemId, currentStatus)
      .subscribe(itemdata => {
        if (itemdata) {
          this.itemBind();
        }
      }, (err) => {
        console.log(err);
      }
      );
  }

  updateAllItemStatus(currentStatus: boolean): void {
    this.itemService.updateAllItemStatus(currentStatus)
      .subscribe(itemdata => {
        if (itemdata) {
          //          debugger
          this.itemBind();
        }
      }, (err) => {
        console.log(err);
      }
      );
  }
}




@Pipe({ name: 'evenodd' })
export class EvenOddPipe implements PipeTransform {
  transform(value: any[], filter: string) {
    if (!value || (filter !== 'even' && filter !== 'odd')) {
      return value;
    }
    return value.filter((item, idx) => filter === 'even' ? idx % 2 === 1 : idx % 2 === 0);
  }
}