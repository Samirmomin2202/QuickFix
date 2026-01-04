import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Profile, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;
  private profileImageUpdated = new Subject<string>();
  public profileImageUpdated$ = this.profileImageUpdated.asObservable();

  constructor(private http: HttpClient) {}

  notifyProfileImageUpdate(imageUrl: string): void {
    this.profileImageUpdated.next(imageUrl);
  }

  getMyProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.apiUrl}/me`);
  }

  getProfileByUserId(userId: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.apiUrl}/user/${userId}`);
  }

  updateProfile(data: Partial<Profile>): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${this.apiUrl}/me`, data);
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
    return this.http.put<any>(`${this.apiUrl}/upload-image`, formData).pipe(
      tap(response => {
        if (response.data?.profileImage) {
          this.notifyProfileImageUpdate(response.data.profileImage);
        }
      })
    );
  }

  deleteProfileImage(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-image`).pipe(
      tap(() => {
        this.notifyProfileImageUpdate('default-avatar.png');
      })
    );
  }
}
