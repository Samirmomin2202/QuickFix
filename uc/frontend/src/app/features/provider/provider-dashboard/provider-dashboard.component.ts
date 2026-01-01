import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { Booking, Service, User } from '@core/models';

@Component({
  standalone: false,
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss']
})
export class ProviderDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.bookings.length;
    this.stats.pending = this.bookings.filter(b => b.status === 'pending').length;
    this.stats.confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
    this.stats.completed = this.bookings.filter(b => b.status === 'completed').length;
  }

  updateBookingStatus(bookingId: string, status: string): void {
    const validStatus = status as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    this.bookingService.updateBooking(bookingId, { status: validStatus }).subscribe({
      next: () => {
        alert('Booking status updated successfully');
        this.loadBookings();
      },
      error: (error) => {
        alert('Error updating booking: ' + error.message);
      }
    });
  }

  getServiceName(booking: Booking): string {
    return typeof booking.service === 'object' ? booking.service.name : 'Service';
  }

  getUserName(booking: Booking): string {
    return typeof booking.user === 'object' ? booking.user.name : 'Customer';
  }

  getUserPhone(booking: Booking): string {
    return typeof booking.user === 'object' ? booking.user.phone : 'N/A';
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warn',
      'confirmed': 'primary',
      'in-progress': 'accent',
      'completed': 'accent',
      'cancelled': ''
    };
    return colors[status] || '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
