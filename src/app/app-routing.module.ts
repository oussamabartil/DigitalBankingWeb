import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {AccountsComponent} from './accounts/accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


const routes: Routes = [
  { path :"login", component : LoginComponent},
  { path :"", redirectTo: "/login", pathMatch:"full"},

  {path : "admin",component: AdminTemplateComponent,children:[
      {
        path : "",
        component : DashboardComponent
      },
      {
        path : "dashboard",
        component : DashboardComponent
      },
      {
        path : "customers",
        component : CustomersComponent
      },
      {
        path : "accounts",
        component : AccountsComponent
      },
      {
        path : "new-customer",
        component : NewCustomerComponent,
        // canActivate : [AuthorizationGuard],
        // data : {role : "ADMIN"}
      },
      {
        path : "customer-accounts/:id",
        component : CustomerAccountsComponent
      },
      // {
      //   path : "notAuthorized",
      //   // component : NotAuthorizedComponent
      // },
    ]},

  // { path: '**', redirectTo: '/customers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
