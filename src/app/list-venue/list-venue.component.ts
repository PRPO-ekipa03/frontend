// list-venue.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VenueType, VenueStatus, Venue } from '../shared/models/venue'; // Adjust the import path as necessary
import { Router } from '@angular/router';
import { CreateVenueDTO } from '../shared/models/createVenue'; // Adjust the import path as necessary
import { VenuesService } from '../core/services/venues.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-list-venue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-venue.component.html',
  styleUrls: ['./list-venue.component.css'],
})
export class ListVenueComponent {
  /**
   * Which step is currently open (1 through 5).
   * If null, no step is expanded.
   */
  openStep: number | null = null;

  /**
   * Tracks whether each step (index 0 => step 1, etc.) is completed (turn circle green).
   */
  stepsCompleted: boolean[] = [false, false, false, false, false];
  
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: string[] = [];
  
  locations: string[] = [
    'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto',
    'Ptuj', 'Trbovlje', 'Kamnik', 'Jesenice', 'Nova Gorica', 'Murska Sobota',
    'Domžale', 'Škofja Loka', 'Postojna', 'Sežana', 'Izola', 'Piran', 'Bled'
  ];
  selectedLocation: string | null = null;
  
  currency: string = 'USD'; // Ignored as per Venue interface
  pricePerDay: number | null = null;
  
  venueTypes = Object.values(VenueType);
  selectedVenueType: VenueType | null = null;

  // Object to hold all venue data
  venueData: CreateVenueDTO = {
    name: '',
    address: '',
    venueType: VenueType.OTHER, // Default to 'OTHER' to ensure it's never null
    location: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    pricePerDay: 0,
    photos: [],
    capacity: 30,
    status: VenueStatus.AVAILABLE
  };

  constructor(
    private readonly router: Router,
    private readonly venuesService: VenuesService // Inject the service
  ) {}

  /**
   * Toggles the expansion of a given step.
   * If the step is already open, close it; otherwise close any other step and open this one.
   */
  toggleStep(step: number, contentEl: HTMLElement): void {
    if (this.openStep === step) {
      // We are CLOSING it
      this.collapse(contentEl);
      this.openStep = null;
    } else {
      // We are OPENING it
      // If there's another step open, collapse it first:
      if (this.openStep !== null) {
        const oldContent = document.querySelector(
          `.step-item[data-step="${this.openStep}"] .expanded-content`
        ) as HTMLElement;
        if (oldContent) this.collapse(oldContent);
        this.openStep = null;
      }
  
      this.openStep = step;
      this.expand(contentEl);
    }
  }

  expand(element: HTMLElement) {
    // 1) Remove any inline max-height to measure natural height
    element.style.maxHeight = 'none';
    
    // Force reflow by reading a layout property
    const fullHeight = element.scrollHeight + 'px';

    // 2) Re-set max-height to 0, so we can animate from 0 -> fullHeight
    element.style.maxHeight = '0';
    
    // 3) In the next frame, set the real height, so it transitions
    requestAnimationFrame(() => {
      element.style.transition = 'max-height 0.9s ease'; // match your CSS
      element.style.maxHeight = fullHeight;
    });
  }

  collapse(element: HTMLElement) {
    // 1) measure the current height
    const currentHeight = element.offsetHeight; // or scrollHeight

    // 2) set max-height to that height
    element.style.maxHeight = currentHeight + 'px';

    // 3) force reflow
    element.offsetHeight; // reading offsetHeight forces reflow

    // 4) next frame => set max-height to 0
    requestAnimationFrame(() => {
      element.style.transition = 'max-height 0.9s ease';
      element.style.maxHeight = '0';
    });
  }

  onStepItemClick(event: MouseEvent, step: number, contentEl: HTMLElement): void {
    // If not open => open it. If already open => do nothing.
    if (this.openStep !== step) {
      // If some other step was open, collapse it first
      if (this.openStep !== null) {
        const oldContent = document.querySelector(
          `.step-item[data-step="${this.openStep}"] .expanded-content`
        ) as HTMLElement;
        if (oldContent) this.collapse(oldContent);
      }
      // Now expand this step
      this.openStep = step;
      this.expand(contentEl);
    }
  }

  /**
   * Marks a step as completed (turns circle green), then closes it.
   */
  markCompleted(step: number, contentEl: HTMLElement): void {
    // Collect data from the step
    this.collectStepData(step, contentEl);

    // Mark the step as completed
    this.stepsCompleted[step - 1] = true;

    // Collapse the step content
    this.collapse(contentEl);

    // Close the step
    this.openStep = null;
  } 

  /**
   * Collects data from a given step's form controls and stores it in venueData.
   */
  collectStepData(step: number, contentEl: HTMLElement): void {
    switch(step) {
      case 1:
        // Step 1: Basic Information
        const nameInput = contentEl.querySelector('input[placeholder="Enter venue name"]') as HTMLInputElement;
        const addressInput = contentEl.querySelector('input[placeholder="Enter the address of the venue"]') as HTMLInputElement;
        const emailInput = contentEl.querySelector('input[type="email"]') as HTMLInputElement;
        const phoneInput = contentEl.querySelector('input[type="tel"]') as HTMLInputElement;

        this.venueData.name = nameInput.value.trim();
        this.venueData.address = addressInput.value.trim();
        this.venueData.venueType = this.selectedVenueType ?? VenueType.OTHER;
        this.venueData.location = this.selectedLocation ?? '';
        this.venueData.contactEmail = emailInput.value.trim();
        this.venueData.contactPhone = phoneInput.value.trim();
        break;

      case 2:
        // Step 2: Venue Description
        const descriptionTextarea = contentEl.querySelector('textarea') as HTMLTextAreaElement;
        this.venueData.description = descriptionTextarea.value.trim();
        break;

      case 3:
        // Step 3: Price and Availability
        if (this.pricePerDay === null || this.pricePerDay <= 0) {
          alert('Please enter a valid price per day.');
          return;
        }
        this.venueData.pricePerDay = this.pricePerDay;
        // currency is ignored as per Venue interface
        // availableDays is ignored as per Venue interface
        break;

      case 4:
        // Step 4: Provide Pictures
        // Handled separately in onPictureUpload
        break;

      case 5:
        // Step 5: Upload Documents
        // Handled separately in onDocumentUpload
        break;

      default:
        break;
    }
  }

  onDaySelectionChange(event: any, day: string): void {
    if (event.target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  onPictureUpload(event: any): void {
    const files = event.target.files;
    if (files) {
      for(let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.venueData.photos?.push(e.target.result); // Store image as Data URL
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onDocumentUpload(event: any): void {
    const files = event.target.files;
    if (files) {
      for(let i = 0; i < files.length; i++) {
        const file = files[i];
        // Documents are ignored as per Venue interface
        // Optionally, handle them if needed
      }
    }
  }

  /**
   * Finalizes the listing by sending data to the backend.
   */
  finalizeListing(): void {
    console.log('Final Venue Data:', this.venueData);
    
    // Call the createVenue service method
    this.venuesService.createVenue(this.venueData).subscribe({
      next: (createdVenue: Venue) => {
        alert('Venue successfully listed!');
        this.router.navigate(['/home']); // Navigate to home or another relevant page
      },
      error: (err) => {
        console.error('Error listing venue:', err);
        alert('Failed to list venue. Please try again.');
      }
    });
  }

  /**
   * Checks if the form is valid to enable the "I'm done!" button.
   */
  isFormValid(): boolean {
    return (
      this.venueData.name.trim() !== '' &&
      this.venueData.address.trim() !== '' &&
      this.selectedVenueType !== null &&
      this.venueData.location.trim() !== '' &&
      this.venueData.contactEmail.trim() !== '' &&
      this.venueData.pricePerDay > 0
    );
  }

  // ============================================================
  // VenueType Logic
  // ============================================================
  onVenueTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value as VenueType;
    this.selectedVenueType = selectedValue;
    console.log('Selected Venue Type:', this.selectedVenueType);
  }

  formatVenueType(type: VenueType): string {
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  navigateToProfile(): void {
    this.router.navigate(['/home']);
  }
}
