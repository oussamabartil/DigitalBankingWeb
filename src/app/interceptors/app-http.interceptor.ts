import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(`Making request to: ${request.url}`);
    
    // Skip authentication for login requests
    if (request.url.includes("/auth/login")) {
      return next.handle(request);
    }
    
    // Get the token
    const token = this.authService.accessToken;
    console.log("Token for request:", token ? "Present" : "Missing");
    
    // If no token, redirect to login
    if (!token) {
      console.warn("No token available for request to:", request.url);
      this.router.navigateByUrl('/login');
      return throwError(() => new Error('Authentication required'));
    }
    
    // Add token to request
    console.log("Adding token to request:", request.url);
    let newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });
    
    return next.handle(newRequest).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log("Token expired or invalid, redirecting to login");
          this.authService.logout();
        }
        return throwError(() => err);
      })
    );
  }
}
