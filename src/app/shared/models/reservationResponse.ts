export interface ResponseReservationDTO {
  id: number;            // Reservation ID
  venueId: number;       // ID of the venue being reserved
  userId: number;        // ID of the user who made the reservation
  eventId: number;       // ID of the event for which the reservation is made
  reservedDate: string;  // ISO string representation of the reserved date/time
  status: ReservationStatus;  // Status of the reservation (ACTIVE or CANCELED)
}

export enum ReservationStatus {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED'
  }