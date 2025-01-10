import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for built-in pipes like 'date'
import { EventResponseDTO } from '../../shared/models/eventResponse';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  @Input() event: EventResponseDTO | null = null;
}
