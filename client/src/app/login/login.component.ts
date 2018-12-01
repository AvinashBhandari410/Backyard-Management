import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user.model'
import { first } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { ItemService } from '../_services/item.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginshow: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  user: User;
  signedUp: boolean;


  constructor(private userService: UserService, private route: ActivatedRoute, private itemService: ItemService,
    private router: Router,
    private fb: FormBuilder) {
  }

  // login
  login(): void {
    // sign up
    this.userService.login(this.loginForm.value)
      .subscribe(userdata => {
        if (userdata != null) {
          // this.signedUp=true
          // this.loginshow=true
          this.user = userdata;

          if (this.user.user_type.toLocaleLowerCase() == "admin") {
            localStorage.setItem('currentUser', this.user._id);
            this.router.navigate(["/admindashboard"]);
          }
          else if (userdata.is_useractive === true && this.user.user_type.toLocaleLowerCase() === "user") {
            localStorage.setItem('currentUser', this.user._id);
            this.router.navigate(["/dashboard"]);
          }
          else {
            // pop up user is not active.
          }
        }
        else {

          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  }
  // sign up
  signup(): void {
    this.userService.signUp(this.signupForm.value)
      .subscribe(userdata => {
        debugger
        if (userdata) {

          var mailContent = {
            from: "avinash.bhandari24@gmail.com",
            to: userdata.email_address,
            subject: "Backyard Management: New item approval request",
            text: "Hello Admin, <br/> Please approve below item request User fullname: " + userdata.full_name + "<br/> Email Address: " + userdata.email_address + "Please click here for approval" + "localhost:4200/login"
            //text: "test mail"
          }
          this.itemService.sendMail(mailContent).subscribe(userdata => {
            // debugger
            // this.signedUp = true
            // this.loginshow = true
            console.log('response from email', userdata);

          },
            err => {
              console.log(err);
            }
          );
        };
      }, err => {
        console.log(err);
      }
      );
  } //signUp ends

  // ngOnInit
  ngOnInit() {
    // updateOn default is change other option is blur or submit
    this.signupForm = this.fb.group({
      full_name: ['', Validators.compose([
        Validators.required,
      ])],
      email_address: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        this.validateEmail
      ])],
      password: ['', Validators.compose([
        Validators.required,
        this.validatePassword
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        this.validatePassword
      ])],
      phone_number: ['', Validators.compose([
        Validators.required
      ])],
      address: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.loginForm = this.fb.group({
      email_address: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        this.validateEmail
      ])],
      password: ['', Validators.compose([
        Validators.required,
        this.validatePassword
      ])]
    });


  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    else {
      return { 'validateEmail': true }
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,15}$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    else {
      return { 'validatePassword': true }
    }
  }
  // login :: validation check
  //get email_address() { return this.loginForm.get('email_address').value; }
  //get password() { return this.loginForm.get('password').value; }

  // signup :: validation check
  // get full_name() { return this.signupForm.get('full_name'); }

  // get signupemailVal() { return this.signupForm.get('signupEmail'); }
  // get signuppasswordVal() { return this.signupForm.get('signupPassword'); }
  // get signupconfirmPasswordVal() { return this.signupForm.get('signupconfirmPassword'); }
}
