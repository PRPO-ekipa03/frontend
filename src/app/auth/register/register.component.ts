import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Holds the user's input values.
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  // Optional message to show any errors or success info
  message = '';

  /**
   * Handles the form submission.
   * Here you can add more logic, such as form validation, 
   * sending data to a service, or redirecting.
   */
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent default page reload

    // Example: Basic password mismatch check
    if (this.formData.password !== this.formData.confirmPassword) {
      this.message = 'Passwords do not match!';
      return;
    }

    // Example: Clear any previous error messages
    this.message = '';

    // Typically, you'd call a service here to handle registration.
    // e.g. this.authService.register(this.formData).subscribe( ... );

    // For now, just log or display a success message
    console.log('Form submitted successfully:', this.formData);
  }
}
