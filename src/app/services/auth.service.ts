import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import {Router} from '@angular/router'
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//
//   isAuthenticated : boolean =false;
//   roles : any;
//   username : any;
//   accessToken! : string;
//
//   constructor(private http:HttpClient) { }
//
//
//   public login(username : string, password : string){
//     let options={
//       headers : new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded")
//     }
//     let params=new HttpParams()
//       .set("username",username).set("password",password);
//     return this.http.post("http://localhost:8085/auth/login",params,options)
//   }
//
//   loadProfile(data: any) {
//
//      this.accessToken = data['access_token'];
//      let decodeJwt:any = jwtDecode(this.accessToken);
//     console.log("Decoded JWT:", decodeJwt); // Log the entire decoded token
//
//     this.username = decodeJwt.sub;
//       this.roles =decodeJwt.scope;
//     console.log("User roles:", this.roles);
//     this.isAuthenticated=true;
//
//   }
// }
//




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  
  // Use a private variable to store the token in memory
  private _accessToken: string = '';
  
  // Getter for the access token
  get accessToken(): string {
    // First try to get from memory
    if (this._accessToken) {
      return this._accessToken;
    }
    // Then try to get from localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        this._accessToken = token;
        return token;
      }
    }
    return '';
  }
  
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize token from storage on service creation only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadJwtTokenFromLocalStorage();
    }
  }
  //
  // public login(username : string, password : string) {
  //   let options = {
  //     headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
  //   }
  //   let params = new HttpParams()
  //     .set("username", username).set("password", password);
  //   return this.http.post(environment.backendHost+"/auth/login", params, options);
  // }
  //
  // loadProfile(data: any) {
  //   if (!data?.accessToken) {  // Add null check
  //     console.error('No access token provided');
  //     return;
  //   }
  //
  //   this.isAuthenticated = true;
  //   this.accessToken = data.accessToken;  // Changed from data['access-token']
  //   let decodedJwt: any = jwtDecode(this.accessToken);
  //   this.username = decodedJwt.sub;
  //   this.roles = decodedJwt.scope;
  //   window.localStorage.setItem("jwt-token", this.accessToken);
  // }

  // auth.service.ts
  // public login(username: string, password: string) {
  //   let options = {
  //     headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
  //   };
  //   let params = new HttpParams()
  //     .set("username", username)
  //     .set("password", password);

  //   return this.http.post<{accessToken: string}>( // Add proper response type
  //     environment.backendHost + "/auth/login",
  //     params,
  //     options
  //   );
  // }


  public login(username: string, password: string) {
  console.log("Attempting login with:", username);
  
  // Try with form-urlencoded (original approach)
  let options = {
    headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
  };
  let params = new HttpParams()
    .set("username", username)
    .set("password", password);
  
  return this.http.post(environment.backendHost + "/auth/login", params, options);
}

  loadProfile(data: any) {
    console.log("Login response data:", data);

    // Get token from response
    const token = data.access_token || data.accessToken || data.token;

    if (!token) {
      console.error('No access token in response:', data);
      return;
    }

    // Store token in memory
    this._accessToken = token;

    // Store token in localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
    }

    this.isAuthenticated = true;
    this.loadProfileFromToken(token);
  }

  loadProfileFromToken(token: string) {
    try {
      let decodedJwt: any = jwtDecode(token);
      this.username = decodedJwt.sub;
      this.roles = decodedJwt.scope;
    } catch (error) {
      console.error('Invalid token:', error);
      this.logout();
    }
  }

  logout() {
    this._accessToken = '';

    // Remove token from localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }

    this.isAuthenticated = false;
    this.username = null;
    this.roles = null;
    this.router.navigateByUrl('/login');
  }

  loadJwtTokenFromLocalStorage() {
    console.log("Checking for stored token...");

    // Only access localStorage in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      console.log("Not in browser environment, skipping localStorage access");
      return false;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      console.log("Found stored token");
      try {
        // Store token in memory
        this._accessToken = token;

        // Load user profile from token
        let decodeJwt = jwtDecode(token);
        this.username = decodeJwt.sub;
        this.roles = (decodeJwt as any).scope;
        this.isAuthenticated = true;

        console.log("Successfully loaded profile from stored token");
        return true;
      } catch (error) {
        console.error("Error loading stored token:", error);
        this.logout();
        return false;
      }
    }

    console.log("No stored token found");
    return false;
  }

}
