import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';
import { Location } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  hidePassword = true;
  showOTPDialog = false;
  otpSent = false;
  registrationData: any = null;
  countdown = 0;
  countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user']
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.registrationData = this.registerForm.value;

      // Send OTP to email with registration data
      this.authService.sendOTP(this.registrationData).subscribe({
        next: (response) => {
          this.showOTPDialog = true;
          this.otpSent = true;
          this.loading = false;
          this.startCountdown(600); // 10 minutes
          this.snackBar.open('OTP sent to your email!', 'Close', { duration: 5000 });
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to send OTP', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  verifyOTP(): void {
    if (this.otpForm.valid) {
      this.loading = true;
      
      const verificationData = {
        ...this.registrationData,
        otp: this.otpForm.get('otp')?.value
      };

      this.authService.verifyOTPAndRegister(verificationData).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
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
      
      this.authService.sendOTP(this.registrationData).subscribe({
        next: (response) => {
          this.loading = false;
          this.otpForm.reset();
          this.startCountdown(600);
          this.snackBar.open('OTP resent to your email!', 'Close', { duration: 3000 });
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
    this.otpForm.reset();
    this.clearCountdown();
  }

  startCountdown(seconds: number): void {
    this.clearCountdown();
    this.countdown = seconds;
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearCountdown();
        this.snackBar.open('OTP expired. Please request a new one.', 'Close', { duration: 5000 });
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

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  goBack(): void {
    this.location.back();
  }
}
