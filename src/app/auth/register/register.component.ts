import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../shared/models/registerRequest';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Holds the user's input values (no extra fields).
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  // Tracks missing fields by name.
  missingFields: { [key: string]: boolean } = {};

  // Message area to show errors or success info.
  message = '';

  constructor(private readonly authService: AuthService) {}

  /**
   * Handles the form submission:
   *  1) Checks for empty fields.
   *  2) Validates email format.
   *  3) Ensures password length >= 8.
   *  4) Checks password match.
   *  5) Builds payload and calls authService.
   */
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent page reload

    // Reset missingFields object
    this.missingFields = {};

    // Check for empty required fields
    Object.entries(this.formData).forEach(([key, value]) => {
      if (value.trim() === '') {
        this.missingFields[key] = true; // Mark field as missing
      }
    });

    // Validate missing fields
    if (Object.keys(this.missingFields).length > 0) {
      this.message = 'Please fill in all required fields.';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.message = 'Invalid email format.';
      return;
    }

    // Validate password length (at least 8 chars)
    if (this.formData.password.length < 8) {
      this.message = 'Password must be at least 8 characters long.';
      return;
    }

    // Validate password match
    if (this.formData.password !== this.formData.confirmPassword) {
      this.message = 'Passwords do not match!';
      return;
    }

    // Clear any previous message
    this.message = '';

    // Prepare a request payload to send to the backend
    const payload: RegisterRequest = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      username: this.formData.username,
      password: this.formData.password
    };

    // Make the API call to register using AuthService
    this.authService.register(payload).subscribe({
      next: () => {
        // Handle success. For example, reset the form or show a message:
        this.resetForm();
        this.message = 'Registration successful!';
      },
      error: (error) => {
        // Handle any error that may occur during registration:
        this.message = error.error?.message || 'Registration failed!';
        console.log(this.message);
      }
    });
  }

  /**
   * Resets the form fields.
   */
  private resetForm(): void {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
    this.missingFields = {};
  }
}
