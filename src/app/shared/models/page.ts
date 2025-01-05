export interface Page<T> {
    content: T[]; // The data for the current page
    totalPages: number; // Total number of pages
    totalElements: number; // Total number of elements across all pages
    size: number; // Number of elements per page
    number: number; // Current page number (0-based)
    numberOfElements: number; // Number of elements on the current page
    first: boolean; // Is this the first page?
    last: boolean; // Is this the last page?
    empty: boolean; // Is the page empty?
  }