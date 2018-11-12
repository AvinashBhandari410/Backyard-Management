import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  welcomeUser: string = "Welcome Admin"
  constructor() { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('currentUser')
  }
}
