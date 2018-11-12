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

const routes: Routes = [{ path: '', component: HomePageComponent },
{ path: 'dashboard', component: DashboardComponent,  children: [
  {path: 'addItem', component: AddItemComponent},
  {path: 'userItemManagement', component: UserItemManagementComponent}
  // otherwise redirect to home
  //{ path: '**', component: HomeDashboardComponent }
],canActivate: [AuthGuard] },
{ path: 'admindashboard', component: AdmindashboardComponent,  children: [
  {path: 'adminApprovalItems', component: ItemMangementComponent},
  {path: 'adminApprovalUser', component: UserManagementComponent}
  // otherwise redirect to home

],canActivate: [AuthGuard] },
{ path: 'homepage', component: HomeDashboardComponent,  children: [
  {path: 'Login', component: LoginComponent},
  {path: 'home', component: HomePageComponent}
  // otherwise redirect to home

],canActivate: [AuthGuard] }
]



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
