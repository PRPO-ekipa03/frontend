export interface ResponseRatingDTO {
  id: number;            // Rating ID
  ratingValue: number;   // Rating value (0.0 to 5.0)
  newAverageRating: number;
  newRatingCount: number;
  userId: number;        // ID of the user who provided the rating
  comment?: string;      // Optional comment for the rating
  timestamp: string;     // Date and time when the rating was given
}
