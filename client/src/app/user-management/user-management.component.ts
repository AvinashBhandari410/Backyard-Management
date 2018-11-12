import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[]

  constructor(private userService: UserService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder) { }

    ngOnInit() {
      this.userBind();  
    }
  
    userBind() 
    {
      // getting all rides and fill
      this.userService.getAllUsers()
        .subscribe(userData => {
          if (userData) {
            this.users = userData
          }
        }, err => {
          console.log('Something went wrong!');
        }
        );  //saveItem ends
    }

    updateStatus(_userId: string, isUserActive: boolean): void {
      this.userService.updateStatus(_userId, isUserActive)
        .subscribe(userData => {
          debugger
          if (userData) {
            this.userBind();
          }
        }, (err) => {
          console.log(err);
        }
        );
    }
}
