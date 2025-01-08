import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../core/services/events.service';
import { EventCreateDTO, EventStatus } from '../shared/models/createEvent';        // Define or import the interface
import { EventResponseDTO } from '../shared/models/eventResponse';      // Define or import the interface
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  eventName = '';
  eventType = '';
  eventDate: Date | null = null;
  eventAddress = '';
  eventDescription = '';
  invitationText = '';
  
  inviteInput = '';
  invitedEmails: string[] = [];

  showPaymentModal = false;
  showReservationModal = false;
  
  selectedVenue: { id: string; name: string; location: string; imagePath: string; venuePrice: number; selectedDate: string } | null = null;

  constructor(
      private readonly eventService: EventsService,
    ) {}

  ngOnInit() {
    // Retrieve event data from localStorage if it exists
    const savedEventData = localStorage.getItem('createEventData');
    if (savedEventData) {
      const eventData = JSON.parse(savedEventData);
      this.eventName = eventData.name || '';
      this.eventType = eventData.type || '';
      this.eventDate = eventData.date ? new Date(eventData.date) : null;
      this.eventAddress = eventData.address || '';
      this.invitationText = eventData.invitation || '';
      this.invitedEmails = eventData.invitedEmails || [];
    }

    // Retrieve selected venue data from localStorage if it exists
    const savedVenueData = localStorage.getItem('rentedVenueData');
    if (savedVenueData) {
      this.selectedVenue = JSON.parse(savedVenueData);
      if (this.selectedVenue?.selectedDate) {
        this.eventDate = new Date(this.selectedVenue.selectedDate);
      }
    }

    if (this.selectedVenue) {
      this.selectedVenue.venuePrice = 18.99
    }
  }

  addEmail() {
    const trimmed = this.inviteInput.trim();
    if (trimmed && !this.invitedEmails.includes(trimmed)) {
      this.invitedEmails.push(trimmed);
    }
    this.inviteInput = '';
  }

  removeEmail(email: string) {
    this.invitedEmails = this.invitedEmails.filter(e => e !== email);
  }

  saveAndRedirectToVenue() {
    // Save current form data to localStorage
    const eventData = {
      name: this.eventName,
      type: this.eventType,
      date: this.eventDate,
      address: this.eventAddress,
      invitation: this.invitationText,
      invitedEmails: this.invitedEmails

    };
    localStorage.setItem('createEventData', JSON.stringify(eventData));

    // Redirect to venue selection page
    window.location.href = '/venues'; // Replace with your actual venue page route
  }

  removeSelectedVenue(): void {
    localStorage.removeItem('rentedVenueData'); // Remove from localStorage
    this.selectedVenue = null; // Remove from view
  }

  proceed(): void {
    // If a venue is selected, show Payment Modal
    this.openSummaryModal()
    /*
    if (this.selectedVenue) {
      this.showPaymentModal = true;
    } 
    // If venue is not selected, show Reservation Successful Modal
    else {
      this.showReservationModal = true;
    }*/
  }

  payWithPayPal(): void {
    // Assume you have a reservationId for the venue, or you pass needed info in the request
    const reservationId = 123; // example
    const paymentRequestDTO = {
      // your PaymentRequestDTO shape:
      amount: this.selectedVenue?.venuePrice ?? 17.99,
      currency: 'USD',
      // ...any other needed properties
    };

  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  closeReservationModal(): void {
    this.showReservationModal = false;
  }

  openSummaryModal(): void {
    const modalElement = document.getElementById('eventSummaryModal');
    if (modalElement === null) {
      console.error('Modal element not found');
      return;
    }
    const summaryModal = new bootstrap.Modal(modalElement);
    summaryModal.show();
  }
  
  confirmEvent(): void {
    const eventDTO: EventCreateDTO = {
      name: this.eventName,
      description: this.eventDescription,
      location: this.eventAddress,
      eventDate: this.eventDate ? new Date(this.eventDate).toISOString() : new Date().toISOString(),
      venueId: this.selectedVenue ? Number(this.selectedVenue.id) : 0,
      status: EventStatus.UPCOMING,
      guestIds: []  // Adjust this if you need to map invitedEmails or other logic
    };

    if (this.selectedVenue) {
      // If venue selected, call createEventWithReservation
      this.eventService.createEventWithReservation(eventDTO).subscribe(
        (response: EventResponseDTO) => {
          console.log('Event with reservation created:', response);
          this.showPaymentModal = true;
        },
        error => {
          console.error('Error creating event with reservation:', error);
        }
      );
    } else {
      // If no venue, call createEvent
      this.eventService.createEvent(eventDTO).subscribe(
        (response: EventResponseDTO) => {
          console.log('Event created:', response);
          this.showReservationModal = true;
        },
        error => {
          console.error('Error creating event:', error);
        }
      );
    }
  }
} 
