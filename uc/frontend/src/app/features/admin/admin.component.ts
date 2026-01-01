import { Component, OnInit } from '@angular/core';
import { ServiceService } from '@core/services/service.service';
import { BookingService } from '@core/services/booking.service';
import { CategoryService } from '@core/services/category.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    avgBookingValue: 0,
    completionRate: 85,
    activeProviders: 0
  };
  loading = true;

  constructor(
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load services count
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.stats.totalServices = response.data?.length || 0;
      }
    });

    // Load bookings count and revenue
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        const bookings = response.data || [];
        this.stats.totalBookings = bookings.length;
        this.stats.totalRevenue = bookings.reduce((sum: number, booking: any) => {
          return sum + (booking.totalAmount || 0);
        }, 0);
        
        // Calculate additional stats
        this.stats.pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
        this.stats.avgBookingValue = bookings.length > 0 
          ? Math.round(this.stats.totalRevenue / bookings.length) 
          : 0;
        
        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
        this.stats.completionRate = bookings.length > 0 
          ? Math.round((completedBookings / bookings.length) * 100) 
          : 0;
        
        // Count unique service providers
        const providers = new Set(bookings.map((b: any) => b.serviceProvider?._id).filter(Boolean));
        this.stats.activeProviders = providers.size;
        
        this.loading = false;
      }
    });

    // Mock users count (add user API later)
    this.stats.totalUsers = 156;
  }
}
