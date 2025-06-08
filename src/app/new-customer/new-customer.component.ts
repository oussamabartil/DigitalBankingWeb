import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../model/customer.model";
import {CustomerService} from "../services/customer.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-new-customer',
  standalone: false,
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup! : FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb : FormBuilder, private customerService:CustomerService, private router:Router) { }

  ngOnInit(): void {
    this.newCustomerFormGroup=this.fb.group({
      name : this.fb.control('', [Validators.required, Validators.minLength(2)]),
      email : this.fb.control('', [Validators.required, Validators.email])
    });
  }

  handleSaveCustomer() {
    if (this.newCustomerFormGroup.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    let customer: Customer = this.newCustomerFormGroup.value;

    this.customerService.saveCustomer(customer).subscribe({
      next : data => {
        this.isLoading = false;
        this.successMessage = "Customer has been successfully created!";

        // Reset form after success
        setTimeout(() => {
          this.router.navigateByUrl("/admin/customers");
        }, 2000);
      },
      error : err => {
        this.isLoading = false;
        console.log(err);
        this.errorMessage = "Failed to create customer. Please try again.";
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.newCustomerFormGroup.controls).forEach(key => {
      const control = this.newCustomerFormGroup.get(key);
      control?.markAsTouched();
    });
  }
}
