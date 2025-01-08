export interface EventCreateDTO {
    name: string;
    description?: string;
    location: string;
    eventDate: string;  // ISO string representation of Timestamp
    venueId: number;
    status: EventStatus;     // Representing EventStatus as string; adjust if you create a TS enum
    guestIds: number[];
  }
  
export enum EventStatus {
    UPCOMING = 'UPCOMING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
}