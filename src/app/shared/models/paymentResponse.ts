export interface PayResponseDTO {
    paypalOrderId: string;  // PayPal order ID
    amount: number;         // Payment amount
    currency: string;       // Currency code (e.g., USD)
    description: string;    // Payment description
    status: PaymentStatus;  // Payment status
    userId: number;         // User ID associated with the payment
    reservationId: number;  // Reservation ID associated with the payment
    createdAt: string;      // Timestamp when the payment was created (ISO format)
  }
  
  // Enum for PaymentStatus
  export enum PaymentStatus {
    CREATED = 'CREATED',
    CANCELED = 'CANCELED',
    CAPTURED = 'CAPTURED'
  }
  