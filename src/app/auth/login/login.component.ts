import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth.component';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'; // Added ActivatedRoute
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };
  message: string | null = null; // Error message
  missingFields: { [key: string]: boolean } = {}; // Tracks missing fields
  returnUrl: string = '/home'; // Default return URL

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.missingFields = {}; // Reset missing fields
  
    // Check for missing fields
    if (!this.formData.email.trim()) {
      this.missingFields['email'] = true;
    }
    if (!this.formData.password.trim()) {
      this.missingFields['password'] = true;
    }
  
    if (Object.keys(this.missingFields).length > 0) {
      this.message = "Fill required fields"
      return;
    }
  
    // Clear message
    this.message = null;
  
    this.authService.login(this.formData).subscribe({
      next: (response: any) => {
        // Store auth token (if applicable)
        console.log(response)
        const authToken = response.token;
        if (authToken) {
          localStorage.setItem('auth_token', authToken);
        }
        // Redirect to the original intended page or default
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: { error: { message: string }; status: number }) => {
        this.message = error.error?.message || 'Invalid credentials'
      },
    });
  }  
}
