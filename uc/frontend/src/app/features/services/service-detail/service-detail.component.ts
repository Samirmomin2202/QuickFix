import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '@core/services/service.service';
import { BookingService } from '@core/services/booking.service';
import { AuthService } from '@core/services/auth.service';
import { Service } from '@core/models';

@Component({
  standalone: false,
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  service: Service | null = null;
  bookingForm: FormGroup;
  loading = true;
  submitting = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm = this.fb.group({
      scheduledDate: [today, Validators.required],
      scheduledTime: ['10:00', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        landmark: ['']
      }),
      paymentMethod: ['cash', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadService(id);
    }
  }

  loadService(id: string): void {
    this.serviceService.getService(id).subscribe({
      next: (response: any) => {
        this.service = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Service not found');
        this.router.navigate(['/']);
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/600x400/6e45e2/ffffff?text=Service+Image';
  }

  bookService(): void {
    if (!this.isLoggedIn) {
      alert('Please login to book a service');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.bookingForm.valid && this.service) {
      this.submitting = true;
      const bookingData = {
        service: this.service._id,
        ...this.bookingForm.value
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          alert('Booking created successfully!');
          this.router.navigate(['/bookings']);
        },
        error: (error) => {
          alert('Error creating booking: ' + error.message);
          this.submitting = false;
        }
      });
    }
  }

  getDiscountPercentage(): number {
    if (this.service?.discountPrice && this.service.price) {
      return Math.round(((this.service.price - this.service.discountPrice) / this.service.price) * 100);
    }
    return 0;
  }
}
