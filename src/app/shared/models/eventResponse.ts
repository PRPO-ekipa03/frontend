import { EventStatus } from './createEvent';


export interface EventResponseDTO {
    id: number;
    name: string;
    description?: string;
    location: string;
    eventDate: string;  // ISO string representation of Timestamp
    userId: number;
    userName?: string;
    venueId: number;
    venueName?: string;
    status: EventStatus;     // Representing EventStatus as string; adjust if you create a TS enum
    guestIds: number[];
  }
  