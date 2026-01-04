import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models';
import { environment } from '../../../../environments/environment';

// Google Maps type declarations (optional, works without API key)
declare const google: any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  
  profileForm!: FormGroup;
  profile: Profile | null = null;
  loading = false;
  imagePreview: string | null = null;
  uploadsUrl = environment.uploadsUrl;
  googleMapsLoaded = false;
  
  autocomplete: any = null;
  map: any = null;
  marker: any = null;
  showMap = false;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  maxDate = new Date(); // Today's date for DOB

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: [''],
      dateOfBirth: [''],
      bio: ['', [Validators.maxLength(500)]],
      occupation: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
        fullAddress: ['']
      })
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        this.profile = response.data || null;
        this.populateForm();
        this.loading = false;
        
        // Initialize Google Maps after profile loads (if available)
        setTimeout(() => this.checkAndInitializeGoogleMaps(), 500);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to load profile', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  populateForm(): void {
    if (this.profile) {
      this.profileForm.patchValue({
        name: this.profile.name,
        email: this.profile.email,
        phone: this.profile.phone,
        gender: this.profile.gender,
        dateOfBirth: this.profile.dateOfBirth ? new Date(this.profile.dateOfBirth) : null,
        bio: this.profile.bio,
        occupation: this.profile.occupation,
        address: {
          street: this.profile.address?.street || '',
          city: this.profile.address?.city || '',
          state: this.profile.address?.state || '',
          zipCode: this.profile.address?.zipCode || '',
          country: this.profile.address?.country || '',
          fullAddress: this.profile.address?.fullAddress || ''
        }
      });

      // Set image preview if profile has custom image
      if (this.profile.profileImage && this.profile.profileImage !== 'default-avatar.png') {
        this.imagePreview = `${this.uploadsUrl}/profiles/${this.profile.profileImage}`;
      }
    }
  }

  checkAndInitializeGoogleMaps(): void {
    // Check if Google Maps is available
    if (typeof google !== 'undefined' && google.maps) {
      this.googleMapsLoaded = true;
      this.initializeGoogleMaps();
    } else {
      console.warn('Google Maps API not loaded. Map features will be disabled.');
      this.googleMapsLoaded = false;
    }
  }

  initializeGoogleMaps(): void {
    if (!this.addressInput || !this.googleMapsLoaded) return;

    try {
      // Initialize Autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(
        this.addressInput.nativeElement,
        {
          types: ['address'],
          fields: ['address_components', 'geometry', 'formatted_address']
        }
      );

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete!.getPlace();
        if (place.geometry && place.geometry.location) {
          this.updateAddressFromPlace(place);
        }
      });
    } catch (error) {
      console.error('Google Maps initialization error:', error);
    }
  }

  updateAddressFromPlace(place: any): void {
    const addressComponents = place.address_components || [];
    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';

    addressComponents.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        street = component.long_name + ' ';
      }
      if (types.includes('route')) {
        street += component.long_name;
      }
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (types.includes('postal_code')) {
        zipCode = component.long_name;
      }
      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    this.profileForm.patchValue({
      address: {
        street: street.trim(),
        city,
        state,
        zipCode,
        country,
        fullAddress: place.formatted_address || ''
      }
    });

    // Update map if visible
    if (this.showMap && place.geometry?.location) {
      this.updateMapLocation(place.geometry.location);
    }
  }

  toggleMap(): void {
    if (!this.googleMapsLoaded) {
      this.snackBar.open('Google Maps API is not loaded. Please add API key to enable map features.', 'Close', {
        duration: 5000
      });
      return;
    }
    
    this.showMap = !this.showMap;
    
    if (this.showMap && !this.map) {
      setTimeout(() => this.initializeMap(), 100);
    }
  }

  initializeMap(): void {
    if (!this.googleMapsLoaded) return;
    
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Default location (can be user's current location)
    let lat = 28.6139; // New Delhi default
    let lng = 77.2090;

    // Use profile coordinates if available
    if (this.profile?.address?.coordinates?.lat && this.profile?.address?.coordinates?.lng) {
      lat = this.profile.address.coordinates.lat;
      lng = this.profile.address.coordinates.lng;
    }

    const location = { lat, lng };

    this.map = new google.maps.Map(mapElement, {
      center: location,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: location,
      draggable: true
    });

    // Update address when marker is dragged
    this.marker.addListener('dragend', () => {
      if (this.marker) {
        const position = this.marker.getPosition();
        if (position) {
          this.reverseGeocode(position.lat(), position.lng());
        }
      }
    });

    // Allow clicking on map to set location
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.updateMapLocation(event.latLng);
        this.reverseGeocode(event.latLng.lat(), event.latLng.lng());
      }
    });
  }

  updateMapLocation(location: any): void {
    if (this.map && this.marker) {
      this.map.setCenter(location);
      this.marker.setPosition(location);
    }
  }

  reverseGeocode(lat: number, lng: number): void {
    if (!this.googleMapsLoaded) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        this.updateAddressFromPlace(results[0]);
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open('Only image files (JPEG, PNG, GIF) are allowed', 'Close', {
        duration: 3000
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('Image size must be less than 5MB', 'Close', {
        duration: 3000
      });
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload image
    this.uploadImage(file);
  }

  uploadImage(file: File): void {
    this.loading = true;
    this.profileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.snackBar.open('Profile image updated successfully', 'Close', {
          duration: 3000
        });
        if (this.profile) {
          this.profile.profileImage = response.data.profileImage;
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to upload image', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteImage(): void {
    if (confirm('Are you sure you want to delete your profile image?')) {
      this.loading = true;
      this.profileService.deleteProfileImage().subscribe({
        next: (response) => {
          this.imagePreview = null;
          if (this.profile) {
            this.profile.profileImage = 'default-avatar.png';
          }
          this.snackBar.open('Profile image deleted successfully', 'Close', {
            duration: 3000
          });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete image', 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  getProfileImage(): string {
    if (this.imagePreview) {
      return this.imagePreview;
    }
    if (this.profile?.profileImage && this.profile.profileImage !== 'default-avatar.png') {
      return `${this.uploadsUrl}/profiles/${this.profile.profileImage}`;
    }
    return 'assets/images/default-avatar.png';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }

    this.loading = true;
    const formData = this.profileForm.value;

    // Add coordinates if map marker exists
    if (this.marker) {
      const position = this.marker.getPosition();
      if (position) {
        formData.address.coordinates = {
          lat: position.lat(),
          lng: position.lng()
        };
      }
    }

    this.profileService.updateProfile(formData).subscribe({
      next: (response) => {
        this.profile = response.data || null;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000
        });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to update profile', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  calculateAge(): number | null {
    const dob = this.profileForm.get('dateOfBirth')?.value;
    if (!dob) return null;
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
