import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventsService } from '../core/services/events.service';
import { VenuesService } from '../core/services/venues.service';  // Import VenuesService
import { Router, RouterModule } from '@angular/router';                     // Import Router
import { EventResponseDTO } from '../shared/models/eventResponse';
import { ResponseVenueBasicDTO } from '../shared/models/venueBasicResponse';
import { ResponseReservationDTO } from '../shared/models/reservationResponse';
import { PaymentService } from '../core/services/payment.service';  // Import PaymentService
import { PayResponseDTO } from '../shared/models/paymentResponse';      // Import PayResponseDTO


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, EventDetailComponent, NgbModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab: string = '';
  events: EventResponseDTO[] = [];
  venues: ResponseVenueBasicDTO[] = [];  // Store basic venue data
  reservations: ResponseReservationDTO[] = [];  // Store reservations data
  payments: PayResponseDTO[] = []; // Store payment data


  constructor(
    private readonly eventService: EventsService,
    private readonly venuesService: VenuesService,
    private readonly paymentService: PaymentService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'events') {
      this.fetchEvents();
    } else if (tab === 'venues') {
      this.fetchVenues();
    } else if (tab === 'reservations') {
      this.fetchReservations();
    } else if (tab === 'payments') { // New tab for payments
      this.fetchPayments();
    }
  }

  fetchEvents() {
    this.eventService.getEventsByUserId().subscribe({
      next: (events) => this.events = events,
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  fetchVenues() {
    const ownerId = 1; // Replace with actual owner ID logic
    this.venuesService.getVenuesByOwnerId().subscribe({
      next: (venues) => this.venues = venues,
      error: (err) => console.error('Error fetching venues:', err)
    });
  }

  fetchReservations() {
    this.venuesService.getReservationsByUserId().subscribe({
      next: (reservations) => this.reservations = reservations,
      error: (err) => console.error('Error fetching reservations:', err)
    });
  }

  fetchPayments() {
    this.paymentService.getPaymentsByUserId().subscribe({
      next: (payments) => this.payments = payments,
      error: (err) => console.error('Error fetching payments:', err)
    });
  }

  openEventModal(event: EventResponseDTO) {
    const modalRef = this.modalService.open(EventDetailComponent, { centered: true });
    modalRef.componentInstance.event = event;
  }

  redirectToVenue(venueId: number) {
    this.router.navigate(['/venues', venueId]);
  }
}
