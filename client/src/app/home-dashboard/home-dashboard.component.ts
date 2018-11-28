import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {

  isUserLogin: boolean = false;
  
  constructor() { }

  ngOnInit() {
    if(localStorage.getItem('currentUser')!=null && localStorage.getItem('currentUser')!='')
    {
      this.isUserLogin=true;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

}
