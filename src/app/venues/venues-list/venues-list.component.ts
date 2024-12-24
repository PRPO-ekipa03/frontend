import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from '../../shared/models/venue';

@Component({
  selector: 'app-venues-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.css']
})
export class VenuesListComponent {
  @Input() venues: Venue[] = [];
  @Input() hasSearched = false;

  @Output() navigateToDetail = new EventEmitter<number>();

  onShowPricing(venueId: number) {
    this.navigateToDetail.emit(venueId);
  }
}
