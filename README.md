# Angular Front-end Documentation

This documentation provides an extensive overview of the Angular front-end application. It covers project structure, major components, services, guards, interceptors, and best practices followed throughout the codebase. This guide is meant to help developers understand the architecture, design decisions, and how different parts of the application interact with each other.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Components](#components)
  - [Authentication Components](#authentication-components)
  - [Event Management Components](#event-management-components)
  - [Venue Management Components](#venue-management-components)
  - [Profile and Settings Components](#profile-and-settings-components)
  - [Homepage and Navigation](#homepage-and-navigation)
- [Services](#services)
  - [HTTP Service](#http-service)
  - [Authentication Service](#authentication-service)
  - [Event, Payment, and Venue Services](#event-payment-and-venue-services)
- [Guards and Interceptors](#guards-and-interceptors)
  - [Auth Guard](#auth-guard)
  - [HTTP Interceptor](#http-interceptor)
- [Routing](#routing)
- [Best Practices and Design Considerations](#best-practices-and-design-considerations)

## Overview

The Angular front-end application is designed using modern Angular practices such as standalone components, dependency injection, RxJS Observables, and Angular Router. The application primarily deals with user authentication, event creation, venue listing and details, payment processing, profile management, and user settings.

## Project Structure

The application is structured by feature modules, with many components marked as `standalone: true` to reduce the need for NgModules and improve modularity. Key directories include:
- `auth/`: Contains authentication-related components like login and register.
- `core/services/`: Contains singleton services responsible for handling HTTP requests, authentication logic, event operations, payment transactions, and venue management.
- `core/guards/`: Contains route guards for protecting routes based on authentication status.
- `shared/models/`: Contains TypeScript interfaces and models for data transfer objects (DTOs).
- `venues/`, `events/`, `profile/`, etc.: Feature folders for major application sections.

## Components

### Authentication Components

**LoginComponent** and **RegisterComponent** handle user login and registration:
- They use Angular Forms for input validation.
- `LoginComponent` checks for missing input fields, handles form submission, and stores tokens in local storage.
- `RegisterComponent` ensures that all form fields are valid, validates email format, checks password requirements, and calls the AuthService to register new users.
- Both components follow separation of concerns by delegating HTTP calls to the `AuthService`.

### Event Management Components

**CreateEventComponent**:
- Handles the creation of events and, optionally, event reservations.
- Uses services like `EventsService` and `PaymentService` to create events, manage payment flows, and handle venue reservations.
- Utilizes local storage to persist event data across navigation, allowing users to navigate to venue selection and then return.

### Venue Management Components

**ListVenueComponent**:
- Provides a multi-step form for listing a new venue.
- Divided into collapsible sections or steps for basic information, description, pricing, images, and documents.
- Implements smooth animations for expanding and collapsing sections.
- Collects data at each step and compiles a final DTO object to send to the backend through the `VenuesService`.

**VenuesComponent**:
- Acts as a container for searching and listing venues.
- Integrates a calendar component for date selection.
- Implements filtering based on location, venue type, and availability.
- Uses pagination to navigate through lists of venues.
- Allows users to navigate to venue details by selecting a venue from the list.

**VenueDetailsComponent**:
- Displays detailed information about a selected venue.
- Integrates with Leaflet to show the venue location on a map.
- Includes review submission functionality with rating and comments.
- Handles geocoding of addresses to latitude and longitude using OpenStreetMap's Nominatim API.
- Provides reserve functionality that stores selected venue data in local storage and redirects users to event creation.

### Profile and Settings Components

**ProfileComponent**:
- Provides tabs for viewing user-specific data: events, venues, reservations, and payments.
- Fetches data from corresponding services when tabs are activated.
- Uses Angular’s modal service for displaying detailed event information.
- Offers navigation to different parts of the application.

**SettingsComponent**:
- Allows users to update account information, change passwords, and manage settings.
- Implements modals for displaying success/error messages.
- Follows best practices in handling state changes, form resets, and error messaging.

### Homepage and Navigation

**HomepageComponent**:
- Serves as the landing page of the application.
- Implements a scroll listener to update the navigation bar’s styling based on scroll position.
- Uses Angular lifecycle hooks (`ngOnInit`, `ngOnDestroy`) to manage event listeners and clean up resources properly.

## Services

Services in this application follow the singleton pattern using Angular's dependency injection. They encapsulate business logic and HTTP communication, keeping components lean and focused on presentation logic.

### HTTP Service

`HttpService` provides unified methods (`get`, `post`, `put`, `delete`) for HTTP operations. It centralizes error handling and base URL configuration:
- Uses RxJS operators like `catchError` for error handling.
- Handles common HTTP errors and constructs user-friendly error messages.

### Authentication Service

`AuthService`:
- Contains methods like `register`, `login`, `logout`, and `validateToken`.
- Interacts with the backend for authentication-related operations.
- Uses `HttpService` to abstract HTTP calls and handles token storage and removal from local storage.

### Event, Payment, and Venue Services

- `EventsService`: Manages CRUD operations for events, including creating events with or without reservations.
- `PaymentService`: Handles PayPal order creation, success/cancellation callbacks, and fetching payment details.
- `VenuesService`: Provides methods for listing venues, fetching venue details, handling ratings, reservations, and creating new venues.
- All services use dependency injection to access `HttpService` and other utilities, promoting reusability and testability.

## Guards and Interceptors

### Auth Guard

`authGuard`:
- Protects routes by checking for an authentication token in local storage.
- Validates tokens asynchronously using `AuthService`.
- Redirects unauthenticated users to the login page with a `returnUrl` query parameter.
- Uses RxJS operators like `map` and `catchError` for asynchronous flow control.

### HTTP Interceptor

`authInterceptor`:
- Intercepts outgoing HTTP requests to attach the Authorization header when a valid token is present.
- Excludes specific paths like authentication endpoints from interception.
- Uses Angular's HTTP interceptor pattern for centralized request modification and authentication handling.

## Routing

The application uses Angular Router to define routes:
- Routes for home, venues, register, login, list venue, settings, create event, and profile.
- Protected routes use the `authGuard` to ensure only authenticated users can access certain pages.
- Nested routes allow for loading venue details within the venues module.

Example route configuration uses syntax like:
```
path: 'venues', component: VenuesComponent, canActivate: [authGuard]

```
to protect routes and define child routes for detail views.

## Best Practices and Design Considerations

- **Modularity and Standalone Components**: Components are defined as standalone where possible, reducing boilerplate and dependencies on NgModules. This improves maintainability and ease of integration.
  
- **Separation of Concerns**: The application separates presentation logic from business logic. Components handle UI and user interaction, while services manage API calls and state.
  
- **Reactive Programming**: Uses RxJS Observables for asynchronous operations like HTTP requests, form handling, and event processing. Operators such as `map`, `catchError`, and `pipe` ensure clean and readable code.
  
- **Error Handling**: Centralized error handling in `HttpService` provides consistent user feedback and easier debugging. Components display user-friendly error messages.
  
- **Security**: Authentication tokens are stored in local storage with careful handling. Guards and interceptors protect routes and modify requests to include tokens, following security best practices.
  
- **Responsive UI and UX**: The use of Bootstrap modals, animations for collapsible sections, and interactive maps with Leaflet contribute to a responsive and user-friendly interface.
  
- **Performance**: The application uses lazy loading of components where appropriate, minimizes duplicate code through shared services, and efficiently manages subscriptions to avoid memory leaks (e.g., unsubscribing or using Angular's async pipes).
  
- **Scalability**: The clear separation between modules, components, and services, along with dependency injection, makes the codebase scalable. New features can be added with minimal impact on existing functionality.
  
- **Routing and Navigation**: The RouterModule is used extensively with route guards ensuring authenticated access. Query parameters and route parameters are used effectively to pass state and IDs between components.
  
- **Data Persistence**: Local storage is used judiciously to save temporary state (like partially filled forms or selected venues) across navigation, enhancing user experience by preventing data loss.

This documentation covers the architectural and design aspects of the Angular front-end. Developers are encouraged to follow these patterns and best practices when extending or maintaining the application.
