import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from '../../shared/models/venue';

@Component({
  standalone: true,
  selector: 'app-venue-details',
  imports: [CommonModule],
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css'],
})
export class VenueDetailsComponent {
  /**
   * This is the venue data passed in by the parent (VenuesComponent).
   * Marked with `@Input()` so the parent can bind a Venue object to this property.
   */
  @Input() venue!: Venue;
}
