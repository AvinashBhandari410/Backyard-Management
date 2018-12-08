import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AuthGuard } from './_guards/auth.guard';
import { ItemMangementComponent } from './item-mangement/item-mangement.component';
import { AddItemComponent } from './add-item/add-item.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserItemManagementComponent } from './user-item-management/user-item-management.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import { UseritemHistroyComponent } from './useritem-histroy/useritem-histroy.component';
import { ItemRequestComponent } from './item-request/item-request.component';
import {RecentSoldItemsComponent} from './recent-sold-items/recent-sold-items.component';

const routes: Routes = [
{ path: 'dashboard', component: DashboardComponent,  children: [
  {path: 'addItem', component: AddItemComponent},
  {path: 'userItemManagement', component: UserItemManagementComponent},
  {path: 'itemUserInterestHistory', component: UseritemHistroyComponent},
  {path: 'itemRequest', component: ItemRequestComponent},
  {path: 'recentSoldOutItems', component: RecentSoldItemsComponent},
  
  // otherwise redirect to home
  //{ path: '**', component: HomeDashboardComponent }
],canActivate: [AuthGuard] },

{ path: 'admindashboard', component: AdmindashboardComponent,  children: [
  {path: 'adminApprovalItems', component: ItemMangementComponent},
  {path: 'adminApprovalUser', component: UserManagementComponent}
  // otherwise redirect to home

],canActivate: [AuthGuard] },

// { path: 'homepage', component: HomeDashboardComponent,  children: [
//   // {path: '', component: HomePageComponent}
//   // otherwise redirect to home
// ],canActivate: [AuthGuard] },
{path:'',redirectTo:'/homepage',pathMatch:'full'},
{ path: 'homepage', component: HomeDashboardComponent,  children: [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomePageComponent}, //landing page
  {path: 'addItem', component: AddItemComponent},
  {path: 'userItemManagement', component: UserItemManagementComponent},
  {path: 'itemUserInterestHistory', component: UseritemHistroyComponent},
  {path: 'itemRequest', component: ItemRequestComponent},
  {path: 'recentSoldOutItems', component: RecentSoldItemsComponent},
  {path: '', component: HomePageComponent}] }
]



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
