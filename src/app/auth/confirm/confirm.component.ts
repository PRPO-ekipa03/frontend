import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  message: string = 'Confirming your account...';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    // Extract the token from query parameters
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      // Call the confirmUser method from AuthService
      this.authService.confirmUser(token).subscribe({
        next: (response: string) => {
          this.message = response; 
        },
        error: (error) => {
          console.error('Error confirming account:', error);
          this.message = 'There was an error confirming your account. Please try again.';
        }
      });
    } else {
      this.message = 'No confirmation token found in the URL.';
    }
  }
}
