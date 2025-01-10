export interface ResponseVenueDTO {
    id: number; // Long in backend, number in TS
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
    OUTDOOR_AREA = 'OUTDOOR_AREA',
    BANQUET_HALL = 'BANQUET_HALL',
    AUDITORIUM = 'AUDITORIUM',
    WEDDING_HALL = 'WEDDING_HALL',
    SPORTS_ARENA = 'SPORTS_ARENA',
    EXHIBITION_CENTER = 'EXHIBITION_CENTER',
    THEATER = 'THEATER',
    COWORKING_SPACE = 'COWORKING_SPACE',
    ROOFTOP_TERRACE = 'ROOFTOP_TERRACE',
    PRIVATE_VILLA = 'PRIVATE_VILLA',
    BEACHFRONT_AREA = 'BEACHFRONT_AREA',
    FARMHOUSE = 'FARMHOUSE',
    CLUBHOUSE = 'CLUBHOUSE',
    STUDIO_SPACE = 'STUDIO_SPACE',
    OTHER = 'OTHER'
  }