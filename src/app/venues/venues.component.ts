import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { CalendarComponent } from "../calendar/calendar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { VenueType } from '../shared/models/venue'; // Your real VenueType enum
import { VenuesService } from '../core/services/venues.service'; 
import { VenuesListComponent } from './venues-list/venues-list.component'; 
import { ResponseVenueBasicDTO } from '../shared/models/venueBasicResponse'; // Adjust path
import { Page } from '../shared/models/page'; // The Page interface

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [
    CalendarComponent,
    VenuesListComponent,
    FormsModule,
    CommonModule,
    PortalModule,
    RouterModule
  ],
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {
  @ViewChild(CdkPortal) portal!: CdkPortal;
  @ViewChild('dateButton', { static: true }) dateButton!: ElementRef;
  
  private overlayRef!: OverlayRef;

  // Date selection
  selectedDate: string | null = null;
  formattedDate: string | null = null;

  // The user input + suggestions logic
  locations: string[] = [
    'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto',
    'Ptuj', 'Trbovlje', 'Kamnik', 'Jesenice', 'Nova Gorica', 'Murska Sobota',
    'Domžale', 'Škofja Loka', 'Postojna', 'Sežana', 'Izola', 'Piran', 'Bled'
  ];
  userInput: string = '';
  bestSuggestion: string | null = null;

  // Final list of venues to display
  venues: ResponseVenueBasicDTO[] = [];
  hasSearched = false;
  showingDetail = false;

  // VenueType data
  venueTypes = Object.values(VenueType);
  selectedVenueType: VenueType | null = null;

  // ============ PAGINATION PROPERTIES ============
  currentPage: number = 0;
  pageSize: number = 5;

  // We store the page info from the backend 
  pageResponse?: Page<ResponseVenueBasicDTO>;

  constructor(
    private readonly overlay: Overlay,
    private readonly venueService: VenuesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  // ============================================================
  // Lifecycle
  // ============================================================
  ngOnInit(): void {
    const child = this.route.snapshot.firstChild;
    const venueId = child?.paramMap.get('venueId');
    this.showingDetail = !!venueId;

    // Listen to navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.snapshot.firstChild; 
        const venueId = child?.paramMap.get('venueId');
        this.showingDetail = !!venueId;
      });
  }

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

  acceptSuggestion(): void {
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

  openModal(): void {
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
  // VenueType Logic
  // ============================================================
  onVenueTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedVenueType = selectElement.value as VenueType;
    console.log('Selected Venue Type:', this.selectedVenueType);
  }

  formatVenueType(type: VenueType): string {
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // ============================================================
  // Search Venues Logic (with pagination)
  // ============================================================
  searchVenues(): void {
    // If user was looking at detail, switch back to the list view
    if (this.showingDetail) {
      this.showingDetail = false;
      this.router.navigate(['/venues']);
    }
    this.hasSearched = true;
  
    // Prepare filter values (can be string or null)
    const location = this.userInput?.trim() || null;
    const venueType = this.selectedVenueType ?? null;
    const reservedDate = this.selectedDate ? this.selectedDate : null;
  
    if (location || venueType || reservedDate) {
      this.venueService.getAvailableVenues(location, venueType, reservedDate)
        .subscribe({
          next: (data: ResponseVenueBasicDTO[]) => {
            this.venues = data; 
          },
          error: (err) => {
            console.error('Error fetching available venues:', err);
          }
        });
    } else {
      this.getVenuesPage(this.currentPage, this.pageSize);
    }
  }

  // A separate method to handle pagination calls
  getVenuesPage(page: number, size: number): void {
    this.venueService.getVenues(page, size).subscribe({
      next: (pageResponse: Page<ResponseVenueBasicDTO>) => {
        this.pageResponse = pageResponse;
        this.venues = pageResponse.content;
        // Sync currentPage in case the backend returns a different "number"
        this.currentPage = pageResponse.number;
      },
      error: (err) => {
        console.error('Error fetching venues page:', err);
      }
    });
  }

  // Pagination helpers
  nextPage(): void {
    if (this.pageResponse && !this.pageResponse.last) {
      this.getVenuesPage(this.currentPage + 1, this.pageSize);
    }
  }

  prevPage(): void {
    if (this.pageResponse && !this.pageResponse.first) {
      this.getVenuesPage(this.currentPage - 1, this.pageSize);
    }
  }

  onNavigateToDetail(venueId: number): void {
    this.router.navigate(['/venues', venueId], { queryParams: { selectedDate: this.selectedDate }});
    this.showingDetail = true;
  }
}
