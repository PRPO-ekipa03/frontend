// services/venue.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Venue } from '../../shared/models/venue';
import { MOCK_VENUES } from '../../shared/mocks/mock-venues.'

@Injectable({
  providedIn: 'root',
})
export class VenueService {

  constructor() { }

  getVenues(): Observable<Venue[]> {
    // Simulating an API call returning mock data
    return of(MOCK_VENUES);
  }


  /* Example of actual function call for venues.
  getVenues(
    location?: string,
    date?: Date,
    eventType?: string
  ): Observable<Venue[]> {
    let params = new HttpParams();

    // Append location if it’s provided
    if (location) {
      params = params.set('location', location);
    }

    // Append date if it’s provided (and convert to a string as needed)
    if (date) {
      const dateStr = date.toISOString(); // or any date format your API expects
      params = params.set('date', dateStr);
    }

    // Append event type if it’s provided
    if (eventType) {
      params = params.set('eventType', eventType);
    }

    // Make GET request, passing query parameters to the backend
    return this.http.get<Venue[]>(this.baseUrl, { params });
  }

  */
}
