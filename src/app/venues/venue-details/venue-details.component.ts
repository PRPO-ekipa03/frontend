import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

import { Venue } from '../../shared/models/venue';
import { VenueService } from '../../core/services/venueService'; // <-- Make sure path is correct

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css']
})
export class VenueDetailsComponent implements OnInit {
  venue!: Venue; // or `venue: Venue | undefined;` if none found
  venueId!: number;

  mockLocation = {
    lat: 46.056946, // Latitude for Ljubljana
    lng: 14.505751, // Longitude for Ljubljana
  };

  map!: L.Map; // Leaflet map instance

  // Demo images (in real usage, you might store images in the Venue model)
  sampleImages = [
    'assets/images/event1.jpeg',
    'assets/images/event1.jpeg',
    'assets/images/event1.jpeg',

  ];

  // Demo reviews (could come from your venue object or another API)
  reviews = [
    {
      name: 'Name Surname',
      text: 'Amazing place, had a fantastic experience!',
      rating: 8.7
    },
    {
      name: 'Jane Doe',
      text: 'A bit crowded but overall a great venue for events.',
      rating: 6.9
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly venueService: VenueService
  ) {}

  ngOnInit(): void {
    // Grab the venueId from the route param (e.g. /venues/123)
    console.log("works");
    const id = this.route.snapshot.paramMap.get('venueId');
    if (id) {
      this.venueId = +id; // convert to number
      // Fetch the venue from your VenueService mock
      this.venueService.getVenueById(this.venueId).subscribe(found => {
        if (found) {
          this.venue = found;
        } else {
          // Optionally handle "not found" scenario
          console.error('Venue not found with ID =', this.venueId);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // Initialize the map with the mock location
    this.map = L.map('map').setView([this.mockLocation.lat, this.mockLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Add a marker for the mock location
    L.marker([this.mockLocation.lat, this.mockLocation.lng])
      .addTo(this.map)
      .bindPopup('Venue Location')
      .openPopup();
  }

  getRatingText(rating: number): string {
    if (rating >= 0 && rating < 2) return 'Hell';
    if (rating >= 2 && rating < 4) return 'Awful';
    if (rating >= 4 && rating < 6) return 'Poor';
    if (rating >= 6 && rating < 8) return 'Decent';
    if (rating >= 8 && rating < 9) return 'Good';
    if (rating >= 9 && rating < 10) return 'Excellent';
    if (rating === 10) return 'Perfect!';
    return 'Unknown';
  }
  
  getRatingClass(rating: number): string {
    if (rating >= 0 && rating < 2) return 'rating-hell';
    if (rating >= 2 && rating < 4) return 'rating-awful';
    if (rating >= 4 && rating < 6) return 'rating-poor';
    if (rating >= 6 && rating < 8) return 'rating-decent';
    if (rating >= 8 && rating < 9) return 'rating-good';
    if (rating >= 9 && rating < 10) return 'rating-excellent';
    if (rating === 10) return 'rating-perfect';
    return 'rating-unknown';
  }
}
