import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '@core/services/profile.service';
import { AuthService } from '@core/services/auth.service';
import { User, Profile } from '@core/models';
import { environment } from '@environments/environment';

@Component({
  standalone: false,
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss']
})
export class ProviderProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  profile: Profile | null = null;
  profileImageUrl: string = '';
  selectedFile: File | null = null;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      bio: ['', [Validators.maxLength(500)]],
      qualification: ['', [Validators.maxLength(200)]],
      specialization: ['', [Validators.maxLength(200)]],
      experience: ['', [Validators.min(0), Validators.max(50)]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        pincode: ['', [Validators.pattern(/^[0-9]{6}$/)]]
      })
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getMyProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data;
        if (this.profile) {
          this.profileForm.patchValue({
            bio: this.profile.bio || '',
            qualification: this.profile.qualification || '',
            specialization: this.profile.specialization || '',
            experience: this.profile.experience || 0,
            phone: this.currentUser?.phone || '',
            address: {
              street: this.profile.address?.street || '',
              city: this.profile.address?.city || '',
              state: this.profile.address?.state || '',
              pincode: this.profile.address?.pincode || ''
            }
          });
          
          if (this.profile.profileImage) {
            this.profileImageUrl = `${environment.apiUrl}/${this.profile.profileImage}`;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfileImage(): void {
    if (!this.selectedFile) return;

    this.profileService.uploadProfileImage(this.selectedFile).subscribe({
      next: (response: any) => {
        alert('Profile image uploaded successfully!');
        this.selectedFile = null;
        this.loadProfile();
      },
      error: (error) => {
        alert('Error uploading image: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    this.saving = true;
    const profileData = this.profileForm.value;

    this.profileService.updateProfile(profileData).subscribe({
      next: (response: any) => {
        alert('Profile updated successfully!');
        this.saving = false;
        this.loadProfile();
      },
      error: (error) => {
        alert('Error updating profile: ' + error.message);
        this.saving = false;
      }
    });
  }
}
