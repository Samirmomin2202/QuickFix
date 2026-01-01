import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warn',
      'confirmed': 'primary',
      'completed': 'accent',
      'cancelled': ''
    };
    return colors[status] || '';
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          alert('Booking cancelled successfully');
          this.loadBookings();
        },
        error: (error) => {
          alert('Error cancelling booking: ' + error.message);
        }
      });
    }
  }
}
