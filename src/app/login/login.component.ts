import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
})
export class LoginComponent implements OnInit{
  formLogin! : FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private fb : FormBuilder, private authService : AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.formLogin=this.fb.group({
      username : this.fb.control("", [Validators.required]),
      password : this.fb.control("", [Validators.required])
    })
  }

  handleLogin() {
    if (this.formLogin.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    let username = this.formLogin.value.username;
    let pwd = this.formLogin.value.password;

    this.authService.login(username,pwd).subscribe({
      next : data =>{
        this.authService.loadProfile(data);
        this.isLoading = false;
        this.router.navigateByUrl("/admin")
      },
      error : err =>{
        this.isLoading = false;
        console.log(err);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    })
  }

  private markFormGroupTouched() {
    Object.keys(this.formLogin.controls).forEach(key => {
      const control = this.formLogin.get(key);
      control?.markAsTouched();
    });
  }
}
