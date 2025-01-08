import { EventStatus } from './createEvent';


export interface EventUpdateDTO {
    name?: string;
    description?: string;
    location?: string;
    eventDate?: string; // ISO string representation of Timestamp
    status?: EventStatus;    // Representing EventStatus as string; adjust if you create a TS enum
    guestIds?: number[];
  }
  