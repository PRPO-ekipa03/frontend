import { Component, ViewChild, ElementRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { CalendarComponent } from "../calendar/calendar.component";
import { VenueDetailsComponent } from './venue-details/venue-details.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { VenueService } from '../core/services/venueService'; // <-- Make sure this path is correct
import { Venue } from '../shared/models/venue';             // <-- Make sure this path is correct

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [CalendarComponent, VenueDetailsComponent, FormsModule, CommonModule, PortalModule],
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent  {
  @ViewChild(CdkPortal) portal!: CdkPortal;
  @ViewChild('dateButton', { static: true }) dateButton!: ElementRef; // Button reference
  
  private overlayRef!: OverlayRef;
  selectedDate: string | null = null; // Stores the selected date as a string
  formattedDate: string | null = null; // Stores the formatted date for the input

  locations: string[] = [
    'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto',
    'Ptuj', 'Trbovlje', 'Kamnik', 'Jesenice', 'Nova Gorica', 'Murska Sobota',
    'Domžale', 'Škofja Loka', 'Postojna', 'Sežana', 'Izola', 'Piran', 'Bled'
  ];
  filteredLocations: string[] = []; // For filtered suggestions
  userInput: string = ''; // Current user input
  bestSuggestion: string | null = null; // Stores the best matching suggestion

  venues: Venue[] = [];     // Holds the list of venues (mocked or filtered)
  hasSearched = false;      // Indicates if the search button has been clicked

  constructor(
    private readonly overlay: Overlay,
    private readonly venueService: VenueService 
  ) { }


  // ============================================================
  // Location / Suggestions Logic 
  // ============================================================
  onLocationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.userInput = input.value;

    // Find a location that starts with the user input
    const bestMatch = this.locations.find(loc => 
      loc.toLowerCase().startsWith(this.userInput.toLowerCase())
    );

    // If there's a best match and userInput is not empty and not exactly the match
    if (this.userInput && bestMatch && bestMatch.toLowerCase() !== this.userInput.toLowerCase()) {
      this.bestSuggestion = bestMatch;
    } else {
      this.bestSuggestion = null;
    }
  }

  get bestSuggestionSuffix(): string {
    if (this.bestSuggestion) {
      return this.bestSuggestion.substring(this.userInput.length);
    }
    return '';
  }

  acceptSuggestion() {
    if (this.bestSuggestion) {
      this.userInput = this.bestSuggestion;
      this.bestSuggestion = null;
    }
  }

  // ============================================================
  // Calendar / Date Logic 
  // ============================================================
  onDateSelected(date: string): void {
    this.selectedDate = date; 
    this.formattedDate = date; 

    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  openModal() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.dateButton.nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8,
          offsetX: -3,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.attach(this.portal);

    // Close the overlay when clicking on the backdrop
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
    });
  }

  // ============================================================
  // Search Venues Logic
  // ============================================================
  searchVenues(): void {
    // Once the user searches, mark hasSearched as true
    this.hasSearched = true;

    // Call service to get venues (mocked or filtered).
    // Suppose getVenues takes location & date as parameters:
    //   - If these values are empty, it returns random mock data.
    //   - Else, it returns filtered mock data based on location/date.
    this.venueService.getVenues()
      .subscribe((data: Venue[]) => {
        this.venues = data;
      });
  }
}
