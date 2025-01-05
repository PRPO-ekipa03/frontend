// src/app/core/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseUrl = environment.baseUrl; // Replace with your actual API base URL

  constructor(private readonly http: HttpClient) {}

  // Unified GET method
  get<T>(
    endpoint: string,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError((error) => this.handleError(error, endpoint)));
  }

  // Unified POST method
  post<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders;
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError((error) => this.handleError(error, endpoint)));
  }

  // Unified PUT method
  put<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders;
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError((error) => this.handleError(error, endpoint)));
  }

  // Unified DELETE method
  delete<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders;
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError((error) => this.handleError(error, endpoint)));
  }

  // Handle HTTP Errors
  private handleError(error: HttpErrorResponse, endpoint: string): Observable<never> {
    let customError;
    if (error.status === 0) {
      // Network error
      customError = { status: 0, message: 'No connection', originalError: error };
    } else if (error.status === 404) {
      customError = { status: 404, message: `Resource not found at ${endpoint}`, originalError: error };
    } else {
      // Other errors – pass along status and a generic message
      customError = { status: error.status, message: error.message || 'An unexpected error occurred', originalError: error };
    }
    return throwError(() => customError);
  }
}
