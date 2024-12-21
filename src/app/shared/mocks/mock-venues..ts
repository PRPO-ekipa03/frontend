// mocks/mock-venues.ts
import { Venue } from '../models/venue';

export const MOCK_VENUES: Venue[] = [
  {
    id: 1,
    name: 'Venue A',
    location: 'Location A',
    description: `Description for Venue A.
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    rating: 9.5,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 2,
    name: 'Venue B',
    location: 'Location B',
    description: `Description for Venue B.
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    rating: 9.2,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 3,
    name: 'Venue C',
    location: 'Location C',
    description: `Description for Venue C.
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    rating: 9.8,
    imageUrl: 'assets/images/venue1.jpg',
  }
];
