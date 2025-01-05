import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { VenuesService } from '../../core/services/venues.service';
import { Venue } from '../../shared/models/venue';
import { ResponseRatingDTO } from '../../shared/models/ratingResponse';
import { CreateRatingDTO } from '../../shared/models/createRating';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css']
})
export class VenueDetailsComponent implements OnInit {
  venue!: Venue;
  venueId!: number;
  reviews: ResponseRatingDTO[] = [];
  map!: L.Map;
  mapInitialized = false;
  sampleImages = [
    'assets/images/event1.jpeg',
    'assets/images/event1.jpeg',
    'assets/images/event1.jpeg',
  ];

  // Loading spinner flag
  isLoading = true;

  // Variables to store map coordinates
  mapLat!: number;
  mapLng!: number;

  newReview: Partial<CreateRatingDTO> = {
    ratingValue: 0,
    comment: ''
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly venueService: VenuesService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('venueId');
    if (!id) {
      // If there's no ID, stop loading spinner (or handle accordingly)
      this.isLoading = false;
      return;
    }

    this.venueId = +id;

    // 1) Load the venue from the service
    this.venueService.getVenueById(this.venueId).subscribe({
      next: (foundVenue) => {
        this.venue = foundVenue;
        console.log('Found venue:', this.venue);

        // Build the full address
        let fullAddress = this.venue.address;
        if (this.venue.location) {
          fullAddress += `, ${this.venue.location}`;
        }

        // 2) Attempt geocoding. If it fails, use fallback coords (Ljubljana)
        this.geocodeAddress(fullAddress)
          .then(coords => {
            // If geocoding works, store the returned coords
            this.mapLat = coords.lat;
            this.mapLng = coords.lng;
          })
          .catch(err => {
            console.error('Geocoding failed:', err);
            // Fallback: Ljubljana
            this.mapLat = 46.056946;
            this.mapLng = 14.505751;
          })
          .finally(() => {
            // 3) After storing coordinates, load reviews
            this.loadReviews(this.venueId);
          });
      },
      error: (err) => {
        console.error('Venue not found with ID =', this.venueId, err);
        // Even if there's an error, hide the spinner
        this.isLoading = false;
      },
    });
  }

  private geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    if (!address) {
      // If there's no address, reject the promise
      return Promise.reject('No address provided');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return firstValueFrom(this.http.get<any[]>(url))
      .then(results => {
        if (results && results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          };
        } else {
          throw new Error('No geocoding results for address: ' + address);
        }
      });
  }

  private initMap(lat: number, lng: number): void {
    // If there's already a map instance, remove it
    if (this.map) {
      this.map.remove();
    }

    // Create the Leaflet map
    this.map = L.map('map').setView([lat, lng], 13);

    // Load OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Marker
    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(this.venue.name || 'Venue Location')
      .openPopup();
  }

  private loadReviews(venueId: number): void {
    this.venueService.getRatingsByVenueId(venueId).subscribe({
      next: (ratings: ResponseRatingDTO[]) => {
        this.reviews = ratings;
        console.log(this.reviews)
        // All data loaded, stop loading spinner
        this.isLoading = false;
        // Initialize the map after the view is updated
        setTimeout(() => {
          this.initMap(this.mapLat, this.mapLng);
          this.mapInitialized = true;
        }, 10);
      },
      error: (err) => {
        console.error('Error fetching ratings for venue:', err);
        // Still hide the spinner even if there's an error
        this.isLoading = false;
        // Initialize the map after the view is updated
        setTimeout(() => {
          this.initMap(this.mapLat, this.mapLng);
          this.mapInitialized = true;
        }, 0);
      }
    });
  }

  submitReview(): void {
    if (!this.newReview.ratingValue || !this.newReview.comment) {
      console.error('Rating value and comment are required.');
      return;
    }

    const ratingDTO: CreateRatingDTO = {
      ratingValue: this.newReview.ratingValue,
      comment: this.newReview.comment,
    };

    this.venueService.addRating(this.venueId, ratingDTO).subscribe({
      next: (response) => {
        console.log('Review added successfully:', response);
        this.reviews.push(response);
        this.resetReviewForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to add review:', err);
      },
    });
  }

  private resetReviewForm(): void {
    this.newReview = {
      ratingValue: 0,
      comment: '',
    };
  }

  private closeModal(): void {
    const modalElement = document.getElementById('addReviewModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  // ==================== Ratings Helpers ====================
  getRatingText(rating: number): string {
    if (rating >= 0 && rating < 2)  return 'Hell';
    if (rating >= 2 && rating < 4)  return 'Awful';
    if (rating >= 4 && rating < 6)  return 'Poor';
    if (rating >= 6 && rating < 8)  return 'Decent';
    if (rating >= 8 && rating < 9)  return 'Good';
    if (rating >= 9 && rating < 10) return 'Excellent';
    if (rating === 10)              return 'Perfect!';
    return 'Unknown';
  }

  getRatingClass(rating: number): string {
    if (rating >= 0 && rating < 2)  return 'rating-hell';
    if (rating >= 2 && rating < 4)  return 'rating-awful';
    if (rating >= 4 && rating < 6)  return 'rating-poor';
    if (rating >= 6 && rating < 8)  return 'rating-decent';
    if (rating >= 8 && rating < 9)  return 'rating-good';
    if (rating >= 9 && rating < 10) return 'rating-excellent';
    if (rating === 10)              return 'rating-perfect';
    return 'rating-unknown';
  }

  onReserve(): void {
    const venueData = {
      id: this.venue.id,
      name: this.venue.name,
      location: this.venue.location,
      description: this.venue.description,
      imagePath: this.sampleImages[0], 
    };
    localStorage.setItem('rentedVenueData', JSON.stringify(venueData));
    this.router.navigate(['/create-event']);
  }
}
