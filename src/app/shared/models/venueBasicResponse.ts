export interface ResponseVenueBasicDTO {
    id: number; // Long in backend, number in TS
    name: string;
    location: string;       // Venue location
    description: string;    // Venue description
    photos: string[];       // Array of photo URLs
    averageRating: number;  // Average rating of the venue
  }
  