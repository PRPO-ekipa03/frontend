import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule],  // Import CommonModule for common directives like *ngIf, etc.
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.css']
})
export class PaymentCancelComponent implements OnInit {
  message: string = 'Processing cancellation...';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly paymentService: PaymentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the token from query parameters
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.paymentService.handleCancel(token).subscribe({
        next: (result) => {
          this.message = result;
          setTimeout(() => this.router.navigate(['/home']), 3000);
        },
        error: (error) => {
          this.message = 'Error processing cancellation.';
          console.error(error);
        }
      });
    } else {
      this.message = 'No cancellation token found.';
    }
  }
}
