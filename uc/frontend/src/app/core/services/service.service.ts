import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Service, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(filters?: {
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }): Observable<ApiResponse<Service[]>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.featured !== undefined) params = params.set('featured', filters.featured.toString());
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sort) params = params.set('sort', filters.sort);
    }

    return this.http.get<ApiResponse<Service[]>>(this.apiUrl, { params });
  }

  getService(id: string): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`);
  }

  getServicesByCategory(categoryId: string): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.apiUrl}/category/${categoryId}`);
  }

  createService(data: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.apiUrl, data);
  }

  updateService(id: string, data: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/upload`, formData);
  }
}
