import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import { AddItemComponent } from './add-item/add-item.component';
import { ItemMangementComponent } from './item-mangement/item-mangement.component';
import { AlertComponent } from './_directives';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { UserManagementComponent } from './user-management/user-management.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UserItemManagementComponent } from './user-item-management/user-item-management.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { AgmCoreModule } from '@agm/core';
import { UseritemHistroyComponent } from './useritem-histroy/useritem-histroy.component';
//import { NgxImageZoomModule } from 'ngx-image-zoom';
// Import the library
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { ItemRequestComponent } from './item-request/item-request.component';
// import {NgbDateCustomParserFormatter} from './shared/dateFormat'
// import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
     AppComponent,
     LoginComponent,
     AlertComponent,
     DashboardComponent,
     PageNotFoundComponent,
     AddItemComponent,
     ItemMangementComponent,
     AdmindashboardComponent,
     FileSelectDirective,
     UserManagementComponent,
     UserItemManagementComponent,
     HomeDashboardComponent,
     HomePageComponent,
     GoogleMapsComponent,
     UseritemHistroyComponent,
     ItemRequestComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBe8qhHfBKRdeOK0iWAQiYtQWStEyQOXC4",
      libraries: ["places"]
    }),
   BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    NgxImgZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
