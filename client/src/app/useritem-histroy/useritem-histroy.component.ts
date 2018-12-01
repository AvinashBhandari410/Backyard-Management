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
export class UseritemHistroyComponent implements OnInit, AfterViewInit {
  // @ViewChild('pickUpToEmailAuto') pickUpToEmailAuto: ElementRef;
  // @ViewChild('pickUpToSubjectAuto') pickUpToSubjectAuto: ElementRef;
  // @ViewChild('pickUpToBodyAuto') pickUpToBodyAuto: ElementRef;
  items: ItemDetails[];
  closeResult: string;
  mailForm: FormGroup;
  modalReference = null;   

  constructor(private itemService: ItemService, private modalService: NgbModal, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.itemBind();

    this.mailForm = this.fb.group({
      pickUpToEmail: ['', Validators.compose([
        Validators.required,
      ])],
      pickUpToSubject: ['', Validators.compose([
        Validators.required,
      ])],
      pickUpToBody: ['', Validators.compose([
        Validators.required,
      ])],
      pickUpFromEmail: [''],
    });
  }

  ngAfterViewInit() {

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

  // modal pop up open starts
  open(content) {
    //this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.modalReference = this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  } // modal pop up open ends

  sendMail() {

    var fromEmail = "avinash.bhandari24@gmail.com";
    var toEmail = ((document.getElementById("pickUpToEmail") as HTMLInputElement).value);
    var toSubject = ((document.getElementById("pickUpToSubject") as HTMLInputElement).value);
    var toBody = ((document.getElementById("pickUpToBody") as HTMLInputElement).value);

    debugger
    this.mailForm.value.pickUpFromEmail = fromEmail;
    this.mailForm.value.pickUpToEmail = toEmail;
    this.mailForm.value.pickUpToSubject = toSubject;
    this.mailForm.value.pickUpToBody = toBody;

    debugger
    var mailContent = {
      from: this.mailForm.value.pickUpFromEmail,
      to: this.mailForm.value.pickUpToEmail,
      subject: this.mailForm.value.pickUpToSubject,
      //text: "Hello Admin, <br/> Please approve below item request User fullname: " + userdata.full_name + "<br/> Email Address: " + userdata.email_address + "Please click here for approval" + "localhost:4200/login"
      text: this.mailForm.value.pickUpToBody
    }
    debugger
    this.itemService.sendMail(mailContent).subscribe(userdata => {
      if (userdata != null) {
        console.log('response from email', userdata);
      }
    },
      err => {
        console.log(err);
      }
    );
    //var data = this.itemService.sendMail(mailContent);
  }
}
