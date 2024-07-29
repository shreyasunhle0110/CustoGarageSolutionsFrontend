import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobCard } from '../models/JobCard';

@Injectable({
  providedIn: 'root'
})
export class JobCardService {
  private apiUrl = 'http://localhost:8080/api/job-cards'; // Update this to your actual API URL

  constructor(private http: HttpClient) { }

  getJobCards(): Observable<JobCard[]> {
    return this.http.get<JobCard[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getJobCard(id: number): Observable<JobCard> {
    return this.http.get<JobCard>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createJobCard(jobCard: JobCard): Observable<JobCard> {
    return this.http.post<JobCard>(this.apiUrl, jobCard).pipe(
      catchError(this.handleError)
    );
  }

  updateJobCard(id: number, jobCard: JobCard): Observable<JobCard> {
    return this.http.put<JobCard>(`${this.apiUrl}/${id}`, jobCard).pipe(
      catchError(this.handleError)
    );
  }

  deleteJobCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
