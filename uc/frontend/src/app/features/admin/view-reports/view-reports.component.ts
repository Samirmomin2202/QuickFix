import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { ServiceService } from '@core/services/service.service';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})
export class ViewReportsComponent implements OnInit {
  loading = true;
  reportData = {
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    averageBookingValue: 0,
    bookingsByStatus: {
      pending: 0,
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    },
    recentBookings: [] as any[]
  };

  constructor(
    private bookingService: BookingService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    // Load bookings data
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        const bookings = response.data || [];
        this.reportData.totalBookings = bookings.length;
        this.reportData.totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
        this.reportData.averageBookingValue = bookings.length > 0 
          ? Math.round(this.reportData.totalRevenue / bookings.length) 
          : 0;

        // Count by status
        this.reportData.bookingsByStatus = {
          pending: bookings.filter((b: any) => b.status === 'pending').length,
          confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
          inProgress: bookings.filter((b: any) => b.status === 'in-progress').length,
          completed: bookings.filter((b: any) => b.status === 'completed').length,
          cancelled: bookings.filter((b: any) => b.status === 'cancelled').length
        };

        // Recent bookings
        this.reportData.recentBookings = bookings.slice(0, 5);
      }
    });

    // Load services data
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.reportData.totalServices = response.data?.length || 0;
        this.loading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getServiceName(booking: any): string {
    return typeof booking.service === 'object' ? booking.service.name : 'Service';
  }

  getUserName(booking: any): string {
    return typeof booking.user === 'object' ? booking.user.name : 'User';
  }
}
