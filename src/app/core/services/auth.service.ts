import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Unified HTTP service
import { RegisterRequest } from '../../shared/models/registerRequest';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  register(payload: RegisterRequest): Observable<any> {
    return this.httpService.post<any>('auth/register', payload);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpService.post<any>('auth/login', credentials);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  validateToken(token: string): Observable<boolean> {
    return this.httpService.post<string>('auth/validate-token', token).pipe(
      // If the request succeeds, map the response to true
      map(response => true),
      // If there's an error (e.g., invalid token), catch it and return false
      catchError(error => of(false))
    );
  }

  // New method to confirm user account using a token
  confirmUser(token: string): Observable<string> {
    const url = `auth/confirm?token=${encodeURIComponent(token)}`;
    return this.httpService.get<string>(
      url,
      { responseType: 'text' } as any // Explicitly set responseType as text
    );
  }

}
