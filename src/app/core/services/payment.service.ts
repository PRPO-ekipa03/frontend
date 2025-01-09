import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequestDTO } from '../../shared/models/createPayment'; // Adjust import path as needed
import { PayResponseDTO } from '../../shared/models/paymentResponse'; // Import the PayResponseDTO interface

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

   /**
   * Creates a PayPal order using the provided payment request and reservation ID.
   * Relies on the gateway to attach userId from the JWT.
   * @param paymentRequest Data for creating the payment.
   * @param reservationId ID of the reservation.
   * @returns An Observable that emits the approval URL as a string.
   */
   createOrder(
    paymentRequest: PaymentRequestDTO,
    reservationId: number
  ): Observable<string> {
    const url = `payments/create?reservationId=${reservationId}`;
    return this.httpService.post<string>(
      url,
      paymentRequest,
      { responseType: 'text' } as any
    );
  }

  /**
   * Handles the success callback for an order by token/orderId.
   * @param token The order token (orderId).
   * @returns An Observable that emits the result message.
   */
  handleSuccess(token: string): Observable<string> {
    const params = new HttpParams().set('token', token);
    return this.httpService.get<string>('payments/success', { params });
  }

  /**
   * Handles the cancellation of an order by token/orderId.
   * @param token The order token (orderId).
   * @returns An Observable that emits the cancellation result message.
   */
  handleCancel(token: string): Observable<string> {
    const params = new HttpParams().set('token', token);
    return this.httpService.get<string>('payments/cancel', { params });
  }

  /**
   * Retrieves order details for a given order ID.
   * @param orderId The ID of the order.
   * @returns An Observable that emits the order details.
   */
  getOrderDetails(orderId: string): Observable<any> {
    return this.httpService.get<any>(`payments/details/${orderId}`);
  }

  /**
   * Retrieves payments for a specific user by their user ID.
   * @param userId The user ID.
   * @returns An Observable that emits a list of PayResponseDTO objects.
   */
  getPaymentsByUserId(): Observable<PayResponseDTO[]> {
    return this.httpService.get<PayResponseDTO[]>('payments/user');
  }
}
