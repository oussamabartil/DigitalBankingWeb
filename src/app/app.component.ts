import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'digital-banking-web';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Check for existing token on app startup
    this.authService.loadJwtTokenFromLocalStorage();
  }
}
