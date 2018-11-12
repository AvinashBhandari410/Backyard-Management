import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ItemService } from '../_services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Item, ItemDetails } from '../_models/item.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  items: ItemDetails[]
  isodd = false;

    public get changeOdd(){
    this.isodd = !this.isodd;
    debugger
    return this.isodd;
  }

  ngAfterViewInit() {

  }
  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.itemBind();  
  }

  itemBind() 
  {
    // getting all rides and fill
    this.itemService.getAllHomeItems(this.items)
      .subscribe(itemdata => {
        if (itemdata) {
          this.items = itemdata
        }
      }, err => {
        console.log('Something went wrong!');
      }
      );  //saveItem ends
  }


}
