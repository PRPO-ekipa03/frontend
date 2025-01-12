import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseVenueBasicDTO } from '../../shared/models/venueBasicResponse'; // Adjust path

@Component({
  selector: 'app-venues-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.css']
})
export class VenuesListComponent {
  @Input() venues: ResponseVenueBasicDTO[] = [];
  @Input() hasSearched = false;

  @Output() navigateToDetail = new EventEmitter<number>();

  onShowPricing(venueId: number) {
    this.navigateToDetail.emit(venueId);
  }

  getTruncatedDescription(description: string, limit: number): string {
    const words = description.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return description;
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * 5) + 1; // random number between 1 and 5
    return `assets/images/event${randomIndex}.jpeg`;
  }

}
