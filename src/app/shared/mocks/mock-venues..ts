// mocks/mock-venues.ts
import { Venue } from '../models/venueMock';

export const MOCK_VENUES: Venue[] = [
  {
    id: 1,
    name: 'Venue A',
    location: 'Location A',
    description: `This is ChatGPT speaking. Imagine standing at the edge of a vast, mist-covered forest where sunlight gently filters through towering, ancient trees. The air carries a serene stillness, broken only by the faint rustle of leaves and distant birdsong. The ground beneath your feet feels alive—soft moss blankets the earth, weaving around exposed roots that twist like gnarled fingers. Shadows dance with every breeze, creating an ever-shifting mosaic of light and dark. It’s a place that feels untouched by time, as though it exists in a world apart, where nature whispers secrets to those who listen.

In the heart of this forest lies a crystalline pond, its surface so still it mirrors the sky above. The water is impossibly clear, revealing smooth stones and faint ripples from fish darting just below. Surrounding the pond are wildflowers in soft hues of lavender, blue, and gold, their delicate petals trembling with the faintest movement of air. The atmosphere hums with life, yet remains tranquil, as if the world itself pauses to admire its reflection. It’s a moment suspended in time, a place where the soul can find quiet, and the mind can wander freely, wrapped in the beauty of an untouched landscape.`,
    rating: 9.5,
    imageUrl: 'assets/images/event1.jpeg',
  },
  {
    id: 2,
    name: 'Venue B',
    location: 'Location B',
    description: `Description for Venue B.`,
    rating: 9.2,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 3,
    name: 'Venue C',
    location: 'Location C',
    description: `Description for Venue C.`,
    rating: 9.8,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 1,
    name: 'Venue A',
    location: 'Location A',
    description: `Description for Venue A.`,
    rating: 9.5,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 2,
    name: 'Venue B',
    location: 'Location B',
    description: `Description for Venue B.`,
    rating: 9.2,
    imageUrl: 'assets/images/venue1.jpg',
  },
  {
    id: 3,
    name: 'Venue C',
    location: 'Location C',
    description: `Description for Venue C.`,
    rating: 9.8,
    imageUrl: 'assets/images/venue1.jpg',
  }
];
