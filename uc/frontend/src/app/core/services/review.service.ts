import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Review, CreateReviewRequest, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getServiceReviews(serviceId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.apiUrl}/service/${serviceId}`);
  }

  createReview(data: CreateReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.apiUrl, data);
  }

  updateReview(id: string, data: Partial<Review>): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(`${this.apiUrl}/${id}`, data);
  }

  deleteReview(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
