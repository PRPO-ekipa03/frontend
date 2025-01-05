import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Unified HTTP service
import { RegisterRequest } from '../../shared/models/registerRequest';
import { Observable, tap } from 'rxjs';

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

}
