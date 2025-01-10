import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('auth_token');

  // If no token is present, redirect to login
  if (!token) {
    console.log('No auth token found, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // If token exists, validate it asynchronously
  return authService.validateToken(token).pipe(
    map((isValid) => {
      if (isValid) {
        console.log('Token is valid, navigation allowed');
        return true; // Allow navigation
      }

      console.log('Invalid token, redirecting to login');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false; // Block navigation
    }),
    catchError(() => {
      console.log('Error validating token, redirecting to login');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false); // Block navigation on error
    })
  );
};
