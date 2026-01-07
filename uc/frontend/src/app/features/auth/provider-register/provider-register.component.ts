import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';
import { ServiceService } from '@core/services/service.service';
import { Location } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-provider-register',
  templateUrl: './provider-register.component.html',
  styleUrls: ['./provider-register.component.scss']
})
export class ProviderRegisterComponent implements OnInit, OnDestroy {
  providerForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  hidePassword = true;
  showOTPDialog = false;
  otpSent = false;
  registrationData: any = null;
  countdown = 0;
  countdownInterval: any;
  availableServices: any[] = [];
  selectedServices: string[] = [];
  profilePicturePreview: string | null = null;
  
  // Multi-step form properties
  currentStep = 1;
  totalSteps = 4;
  steps = [
    { number: 1, title: 'Personal Information', icon: 'person' },
    { number: 2, title: 'Contact Information', icon: 'contact_mail' },
    { number: 3, title: 'Legal Documentation', icon: 'badge' },
    { number: 4, title: 'Professional Information', icon: 'work' }
  ];

  legalDocumentTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving-license', label: 'Driving License' },
    { value: 'voter-id', label: 'Voter ID' }
  ];

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serviceService: ServiceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.providerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', [Validators.required]],
      legalDocumentType: ['', [Validators.required]],
      legalDocumentNumber: ['', [Validators.required]],
      professionalType: ['', [Validators.required]],
      services: [[], [Validators.required]],
      profilePicture: ['']
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });

    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.availableServices = response.data || response || [];
      },
      error: (error) => {
        console.error('Failed to load services:', error);
        this.snackBar.open('Failed to load services', 'Close', { duration: 3000 });
      }
    });
  }

  onServiceSelectionChange(event: any): void {
    this.selectedServices = event.value;
    this.providerForm.patchValue({ services: this.selectedServices });
  }

  getServiceName(serviceId: string): string {
    const service = this.availableServices.find((s: any) => s._id === serviceId);
    return service ? service.name : '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // In a real application, you would upload this to a server
      // For now, we'll just store the file name
      this.providerForm.patchValue({ profilePicture: file.name });
    }
  }

  onSubmit(): void {
    if (this.providerForm.valid) {
      this.loading = true;
      this.registrationData = this.providerForm.value;

      // Since we already sent OTP when moving from step 2 to 3, just show the dialog
      this.showOTPDialog = true;
      this.otpSent = true;
      this.loading = false;
      this.startCountdown(600); // 10 minutes
      this.snackBar.open('Please enter the OTP sent to your email', 'Close', { duration: 5000 });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.providerForm.controls).forEach(key => {
        this.providerForm.get(key)?.markAsTouched();
      });
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
    }
  }

  verifyOTP(): void {
    if (this.otpForm.valid) {
      this.loading = true;
      
      const verificationData = {
        ...this.registrationData,
        otp: this.otpForm.get('otp')?.value
      };

      this.authService.registerProvider(verificationData).subscribe({
        next: (response) => {
          this.snackBar.open('Provider registration successful! Your account is pending verification.', 'Close', { duration: 5000 });
          this.clearCountdown();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Invalid OTP', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  resendOTP(): void {
    if (this.registrationData) {
      this.loading = true;
      
      this.authService.sendProviderOTP({ email: this.registrationData.email }).subscribe({
        next: (response) => {
          this.loading = false;
          this.otpForm.reset();
          this.startCountdown(600);
          this.snackBar.open('OTP resent successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to resend OTP', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  closeOTPDialog(): void {
    this.showOTPDialog = false;
    this.clearCountdown();
  }

  startCountdown(seconds: number): void {
    this.countdown = seconds;
    this.clearCountdown();
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearCountdown();
      }
    }, 1000);
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  getCountdownDisplay(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  goBack(): void {
    this.location.back();
  }

  // Multi-step form navigation methods
  nextStep(): void {
    if (this.validateCurrentStep()) {
      // If moving from step 2 (Contact Information), check if email is available
      if (this.currentStep === 2) {
        this.checkEmailAvailability();
      } else if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.snackBar.open('Please fill all required fields in this step', 'Close', { duration: 3000 });
    }
  }

  checkEmailAvailability(): void {
    const email = this.providerForm.get('email')?.value;
    if (!email) return;

    this.loading = true;
    this.authService.sendProviderOTP({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.currentStep++;
        this.snackBar.open('Email verified! Continue with registration.', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to verify email';
        
        if (errorMessage.toLowerCase().includes('already registered')) {
          this.snackBar.open('This email is already registered. Please login or use a different email.', 'Login', { duration: 7000 })
            .onAction().subscribe(() => {
              this.router.navigate(['/auth/login']);
            });
        } else {
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      }
    });
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Only allow going to previous steps or the next immediate step if current is valid
    if (step < this.currentStep) {
      this.currentStep = step;
    } else if (step === this.currentStep + 1 && this.validateCurrentStep()) {
      this.currentStep = step;
    }
  }

  validateCurrentStep(): boolean {
    let fieldsToValidate: string[] = [];

    switch (this.currentStep) {
      case 1: // Personal Information
        fieldsToValidate = ['firstName', 'lastName', 'gender'];
        break;
      case 2: // Contact Information
        fieldsToValidate = ['email', 'phone', 'password'];
        break;
      case 3: // Legal Documentation
        fieldsToValidate = ['legalDocumentType', 'legalDocumentNumber'];
        break;
      case 4: // Professional Information
        fieldsToValidate = ['professionalType', 'services'];
        break;
    }

    let isValid = true;
    fieldsToValidate.forEach(field => {
      const control = this.providerForm.get(field);
      if (control) {
        control.markAsTouched();
        if (!control.valid) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  isStepValid(step: number): boolean {
    let fieldsToCheck: string[] = [];

    switch (step) {
      case 1:
        fieldsToCheck = ['firstName', 'lastName', 'gender'];
        break;
      case 2:
        fieldsToCheck = ['email', 'phone', 'password'];
        break;
      case 3:
        fieldsToCheck = ['legalDocumentType', 'legalDocumentNumber'];
        break;
      case 4:
        fieldsToCheck = ['professionalType', 'services'];
        break;
    }

    return fieldsToCheck.every(field => this.providerForm.get(field)?.valid);
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }
}
