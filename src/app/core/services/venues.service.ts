import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Unified HTTP service
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue } from '../../shared/models/venue'; // Import the interface
import { ResponseVenueBasicDTO } from '../../shared/models/venueBasicResponse'; // Import the interface
import { CreateVenueDTO } from '../../shared/models/createVenue';
import { ResponseRatingDTO } from '../../shared/models/ratingResponse';
import { CreateRatingDTO } from '../../shared/models/createRating';
import { ResponseReservationDTO } from '../../shared/models/reservationResponse'; // Adjust path as needed

import { Page } from '../../shared/models/page'; // Import the Page interface


@Injectable({
  providedIn: 'root'
})
export class VenuesService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetches paginated venues from the backend.
   * @param page The page number to fetch (0-based index).
   * @param size The number of venues per page.
   * @returns An Observable containing the paginated response with venues.
   */
  getVenues(page: number = 0, size: number = 10): Observable<Page<ResponseVenueBasicDTO>> {
    return this.httpService.get<Page<ResponseVenueBasicDTO>>(`venues?page=${page}&size=${size}`);
  }

  /**
   * Fetches available venues filtered by location, type, and reserved date.
   * @param location The venue location to filter by.
   * @param venueType The type of venue to filter by.
   * @param reservedDate The date to exclude already reserved venues.
   * @returns An Observable containing the list of basic venue data.
   */
  getAvailableVenues(
    location: string | null, 
    venueType: string | null, 
    reservedDate: string | null
  ): Observable<ResponseVenueBasicDTO[]> {
    let params = new HttpParams();
    if (location) {
      params = params.set('location', location);
    }
    if (venueType) {
      params = params.set('venueType', venueType);
    }
    if (reservedDate) {
      params = params.set('reservedDate', reservedDate);
    }
  
    return this.httpService.get<ResponseVenueBasicDTO[]>('venues/available', { params });
  }

  /**
   * Fetches a single venue by its ID.
   * @param venueId The ID of the venue to fetch.
   * @returns An Observable containing the detailed venue data.
   */
  getVenueById(venueId: number): Observable<Venue> {
    return this.httpService.get<Venue>(`venues/${venueId}`);
  }

  /**
   * Creates a new venue.
   * @param venueDTO The data for the new venue.
   * @returns An Observable containing the created venue.
   */
  createVenue(venueDTO: CreateVenueDTO): Observable<Venue> {
    return this.httpService.post<Venue>('venues', venueDTO);
  }

  // Update an existing venue
  updateVenue(venueId: number, venueDTO: CreateVenueDTO): Observable<Venue> {
    return this.httpService.put<Venue>(`venues/${venueId}`, venueDTO);
  }

   // Delete a venue
  deleteVenue(venueId: number): Observable<void> {
    return this.httpService.delete<void>(`venues/${venueId}`);
  }

  /**
   * Fetches ratings for a specific venue by venue ID.
   * @param venueId The ID of the venue to fetch ratings for.
   * @param page The page number to fetch (0-based index).
   * @param size The number of ratings per page.
   * @returns An Observable containing the list of ratings.
   */
  getRatingsByVenueId(venueId: number, page: number = 0, size: number = 10): Observable<ResponseRatingDTO[]> {
    return this.httpService.get<ResponseRatingDTO[]>(`venues/${venueId}/ratings?page=${page}&size=${size}`);
  }

  /**
   * Adds a rating to a specific venue.
   * @param venueId The ID of the venue to add the rating to.
   * @param ratingDTO The data for the rating.
   * @returns An Observable containing the created rating.
   */
  addRating(venueId: number, ratingDTO: CreateRatingDTO): Observable<ResponseRatingDTO> {
    return this.httpService.post<ResponseRatingDTO>(`venues/${venueId}/ratings`, ratingDTO);
  }

  /**
   * Finds venues by owner ID.
   * @param ownerId The ID of the owner whose venues are to be retrieved.
   * @returns An Observable containing a list of ResponseVenueDTO.
   */
  getVenuesByOwnerId(): Observable<ResponseVenueBasicDTO[]> {
    return this.httpService.get<ResponseVenueBasicDTO[]>(`venues/owner`);
  }

  /**
   * Fetches reservations for the current user.
   * @returns An Observable containing a list of ResponseReservationDTO for the user.
   */
  getReservationsByUserId(): Observable<ResponseReservationDTO[]> {
    return this.httpService.get<ResponseReservationDTO[]>(`reservations/user`);
  }
}
