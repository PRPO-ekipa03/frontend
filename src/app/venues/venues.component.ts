import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { CalendarComponent } from "../calendar/calendar.component";
import { VenueDetailsComponent } from './venue-details/venue-details.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';


import { VenueService } from '../core/services/venueService'; 
import { Venue } from '../shared/models/venue';

import { VenuesListComponent } from './venues-list/venues-list.component'; // <-- import child

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [
    // All needed imports
    CalendarComponent,
    VenueDetailsComponent,
    VenuesListComponent,  // <-- declare the child component here
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
  selectedDate: string | null = null;
  formattedDate: string | null = null;

  // The user input and suggestions logic
  locations: string[] = [
    'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto',
    'Ptuj', 'Trbovlje', 'Kamnik', 'Jesenice', 'Nova Gorica', 'Murska Sobota',
    'Domžale', 'Škofja Loka', 'Postojna', 'Sežana', 'Izola', 'Piran', 'Bled'
  ];
  filteredLocations: string[] = [];
  userInput: string = '';
  bestSuggestion: string | null = null;

  venues: Venue[] = [];
  hasSearched = false;
  showingDetail = false;

  constructor(
    private readonly overlay: Overlay,
    private readonly venueService: VenueService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const child = this.route.snapshot.firstChild;
    const venueId = child?.paramMap.get('venueId');
    this.showingDetail = !!venueId;
    // Listen to navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // does param exist?
        const child = this.route.snapshot.firstChild; 
        const venueId = child?.paramMap.get('venueId');

        // If we have a param, show detail, otherwise list.
        this.showingDetail = !!venueId;
        console.log(this.showingDetail)
        console.log("aaa")
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
  // Search Venues Logic
  // ============================================================
  searchVenues(): void {
    // Once the user searches, mark hasSearched as true
    if (this.showingDetail) this.showingDetail=false;
    this.hasSearched = true;

    // Call service to get venues
    this.venueService.getVenues()
      .subscribe((data: Venue[]) => {
        this.venues = data;
      });
  }

  onNavigateToDetail(venueId: number): void {
    
    this.router.navigate(['/venues', venueId]);

    this.showingDetail = true
  }
}
