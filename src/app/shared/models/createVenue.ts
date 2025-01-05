export interface CreateVenueDTO {
    name: string;
    description?: string; // Optional field
    location: string;
    address: string;
    capacity: number;
    amenities?: string[]; // Optional list of strings
    status: VenueStatus; // Enum for venue status
    pricePerDay: number; // BigDecimal in backend, number in TS
    openingTime?: string; // Timestamp in backend, string in TS (ISO format)
    closingTime?: string; // Timestamp in backend, string in TS (ISO format)
    contactEmail: string;
    contactPhone?: string; // Optional field
    photos?: string[]; // Optional list of strings (URLs)
    venueType: VenueType; // Enum for venue type
    ownerId: number; // Long in backend, number in TS
    averageRating?: number; // Optional field
    ratingCount?: number; // Optional field
  }
  
  export enum VenueStatus {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
  }
  
  export enum VenueType {
    CONFERENCE_HALL = 'CONFERENCE_HALL',
    MEETING_ROOM = 'MEETING_ROOM',
    EVENT_SPACE = 'EVENT_SPACE',
    OTHER = 'OTHER'
  }