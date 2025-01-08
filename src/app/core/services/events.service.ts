import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Unified HTTP service
import { Observable } from 'rxjs';
import { EventResponseDTO } from '../../shared/models/eventResponse';  // Define or import the interface
import { EventCreateDTO } from '../../shared/models/createEvent';        // Define or import the interface
import { EventUpdateDTO } from '../../shared/models/updateEvent';        // Define or import the interface

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private readonly httpService: HttpService) { }

  /**
   * Creates a new event.
   * @param eventDTO The data for the new event.
   * @returns An Observable containing the created event.
   */
  createEvent(eventDTO: EventCreateDTO): Observable<EventResponseDTO> {
    return this.httpService.post<EventResponseDTO>('events', eventDTO);
  }

  /**
   * Creates a new event and makes a reservation for the venue.
   * @param eventDTO The data for the new event.
   * @returns An Observable containing the created event.
   */
  createEventWithReservation(eventDTO: EventCreateDTO): Observable<EventResponseDTO> {
    return this.httpService.post<EventResponseDTO>('events/reservation', eventDTO);
  }


  /**
   * Retrieves an event by its ID.
   * @param eventId The ID of the event to fetch.
   * @returns An Observable containing the event data.
   */
  getEventById(eventId: number): Observable<EventResponseDTO> {
    return this.httpService.get<EventResponseDTO>(`events/${eventId}`);
  }

  /**
   * Updates an existing event.
   * @param eventId The ID of the event to update.
   * @param eventUpdateDTO The updated event data.
   * @returns An Observable containing the updated event.
   */
  updateEvent(eventId: number, eventUpdateDTO: EventUpdateDTO): Observable<EventResponseDTO> {
    return this.httpService.put<EventResponseDTO>(`events/${eventId}`, eventUpdateDTO);
  }

  /**
   * Deletes an event by its ID.
   * @param eventId The ID of the event to delete.
   * @returns An Observable that completes once the event is deleted.
   */
  deleteEvent(eventId: number): Observable<void> {
    return this.httpService.delete<void>(`events/${eventId}`);
  }

  /**
   * Retrieves events for the current user based on the X-User-Id header.
   * @returns An Observable containing a list of events for the user.
   */
  getEventsByUserId(): Observable<EventResponseDTO[]> {
    return this.httpService.get<EventResponseDTO[]>(`events/users`);
  }
}
