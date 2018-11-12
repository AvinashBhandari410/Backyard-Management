import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, ItemDetails } from '../_models/item.model';


@Component({
  selector: 'app-user-item-management',
  templateUrl: './user-item-management.component.html',
  styleUrls: ['./user-item-management.component.css']
})
export class UserItemManagementComponent implements OnInit {
  items: ItemDetails[]
  isodd = false;

  public get changeOdd(){
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
    this.itemService.getAllUserItems(localStorage.getItem('currentUser'))
      //     .subscribe((data: any []) => 
      //       {
      //         data = data.filter(function (item) {
      //           console.log(item.userId)
      // //          console.log(localStorage.getItem('currentUser'))
      //           //console.log(item.userId)
      //           return item.userId._id ==  localStorage.getItem('currentUser')
      //             //return userID._id== localStorage.getItem('currentUser')

      //       });
      //     }
      .subscribe(itemdata => {
        if (itemdata) {
          this.items = itemdata
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
  };
  // .subscribe(itemdata => {
  //   debugger
  //   if (itemdata) {
  //     this.items = itemdata
  //   }
  // }, err => {
  //   console.log('Something went wrong!');
  // }
  // );  //saveItem ends


  updateStatus(_itemId: string, isItemSoldout: boolean): void {
    debugger
    this.itemService.updateItemAvailablity(_itemId, isItemSoldout)
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

@Pipe({ name: 'evenodd' })
export class EvenOddPipe implements PipeTransform {
  transform(value: any[], filter: string) {
    if (!value || (filter !== 'even' && filter !== 'odd')) {
      return value;
    }
    return value.filter((item, idx) => filter === 'even' ? idx % 2 === 1 : idx % 2 === 0);
  }
}
