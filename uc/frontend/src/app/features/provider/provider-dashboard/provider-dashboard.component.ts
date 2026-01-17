import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { ProfileService } from '@core/services/profile.service';
import { AuthService } from '@core/services/auth.service';
import { Booking, Service, User, Profile } from '@core/models';
import { environment } from '@environments/environment';

interface DashboardStats {
  totalClients: number;
  activeServices: number;
  monthlyRevenue: number;
  pendingRequests: number;
}

@Component({
  standalone: false,
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss']
})
export class ProviderDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  currentUser: User | null = null;
  profile: Profile | null = null;
  profileImageUrl: string = '';
  
  stats: DashboardStats = {
    totalClients: 0,
    activeServices: 0,
    monthlyRevenue: 0,
    pendingRequests: 0
  };

  recentBookings: Booking[] = [];
  bookingStats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  };

  constructor(
    private bookingService: BookingService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadProfile();
    this.loadBookings();
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data;
        if (this.profile?.profileImage) {
          this.profileImageUrl = `${environment.apiUrl}/${this.profile.profileImage}`;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.calculateStats();
        this.recentBookings = this.bookings.slice(0, 5); // Get latest 5 bookings
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    // Booking stats
    this.bookingStats.total = this.bookings.length;
    this.bookingStats.pending = this.bookings.filter(b => b.status === 'pending').length;
    this.bookingStats.confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
    this.bookingStats.completed = this.bookings.filter(b => b.status === 'completed').length;

    // Dashboard stats
    const uniqueClients = new Set(this.bookings.map(b => 
      typeof b.user === 'object' ? b.user._id : b.user
    ));
    this.stats.totalClients = uniqueClients.size;
    
    this.stats.pendingRequests = this.bookingStats.pending;
    
    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.stats.monthlyRevenue = this.bookings
      .filter(b => {
        const bookingDate = new Date(b.scheduledDate);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               b.status === 'completed';
      })
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Active services (count unique services from bookings)
    const uniqueServices = new Set(this.bookings.map(b => 
      typeof b.service === 'object' ? b.service._id : b.service
    ));
    this.stats.activeServices = uniqueServices.size;
  }

  updateBookingStatus(bookingId: string, status: string): void {
    const validStatus = status as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    this.bookingService.updateBooking(bookingId, { status: validStatus }).subscribe({
      next: () => {
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
