import { Component, ViewChild, ElementRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { CalendarComponent } from "../calendar/calendar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [PortalModule, CalendarComponent, FormsModule, CommonModule],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
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

  constructor(
    private readonly overlay: Overlay
  ) {

  }

  bestSuggestion: string | null = null; // Stores the best matching suggestion

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

  onDateSelected(date: string): void {
    this.selectedDate = date; 
    this.formattedDate = date; 

    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }


  openModal() {
    // Create a position strategy to align the overlay under the button
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.dateButton.nativeElement)
      .withPositions([
        {
          originX: 'start', // Align the left edge of the button
          originY: 'bottom', // Align to the bottom edge of the button
          overlayX: 'start', // Align the overlay's left edge
          overlayY: 'top',   // Align the overlay's top edge to the bottom of the button
          offsetY: 8,        // Add spacing below the button
          offsetX: -3,
        },
      ]);

    // Create the overlay with the position strategy
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true, // Optional: Close overlay on outside click
      backdropClass: 'cdk-overlay-transparent-backdrop', // Transparent backdrop
      scrollStrategy: this.overlay.scrollStrategies.reposition(), // Reposition on scroll
    });

    // Attach the portal (content) to the overlay
    this.overlayRef.attach(this.portal);

    // Close the overlay when clicking on the backdrop
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
    });
  }
} 
