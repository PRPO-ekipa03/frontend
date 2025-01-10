export interface CreateRatingDTO {
    ratingValue: number;  // The value of the rating (e.g., 1-5)
    comment?: string;     // Optional comment for the rating
}