import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {AccountsComponent} from './accounts/accounts.component';

const routes: Routes = [
  {path:"customers",component:CustomersComponent},
   {path: "accounts",component:AccountsComponent},
  { path: '', redirectTo: '/customers', pathMatch: 'full' }, // Redirection par défaut
  // { path: '**', redirectTo: '/customers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
