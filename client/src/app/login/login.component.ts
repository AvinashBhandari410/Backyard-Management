import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user.model'
import { first } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
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


  constructor(private userService: UserService, private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
  }

  // login
  login(): void {
    // sign up
    this.userService.login(this.loginForm.value)
      .subscribe(userdata => {
        debugger
        if (userdata != null) {
          // this.signedUp=true
          // this.loginshow=true
          this.user = userdata;
          
          if (this.user.user_type.toLocaleLowerCase() == "admin") {
            localStorage.setItem('currentUser', this.user._id);
            this.router.navigate(["/admindashboard"]);
          }
          else if(userdata.is_useractive===true && this.user.user_type.toLocaleLowerCase() === "user")
          {
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
          this.signedUp = true
          this.loginshow = true
        }
        else {
          // pop up something went wrong.
        }

      }, err => {
        console.log('Something went wrong!');
      }
      );
  } //signUp ends

  // ngOnInit
  ngOnInit() {
    // updateOn default is change other option is blur or submit
    this.signupForm = this.fb.group({
      full_name: ['', { updateOn: 'blur' }, Validators.required],
      email_address: ['', { updateOn: 'blur' }, Validators.required],
      password: ['', { updateOn: 'blur' }, Validators.required],
      confirmPassword: ['', { updateOn: 'blur' }, Validators.required],
      phone_number: ['', { updateOn: 'blur' }, Validators.required],
      address: ['', { updateOn: 'blur' }, Validators.required]

    });

    this.loginForm = this.fb.group({
      email_address: ['', Validators.required],
      password: ['', Validators.required]
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
