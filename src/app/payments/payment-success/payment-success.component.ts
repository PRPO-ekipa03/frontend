import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  message: string = 'Processing payment...';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly paymentService: PaymentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.paymentService.handleSuccess(token).subscribe({
        next: (result) => {
          this.message = "success";
          setTimeout(() => this.router.navigate(['/profile']), 3000);
        },
        error: (error) => {
          this.message = 'Error processing payment.';
          console.error(error);
        }
      });
    } else {
      this.message = 'No payment token found.';
    }
  }
}
