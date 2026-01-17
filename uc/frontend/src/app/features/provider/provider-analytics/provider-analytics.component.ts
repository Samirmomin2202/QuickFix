import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { Booking } from '@core/models';

interface MonthlyData {
  month: string;
  bookings: number;
  revenue: number;
}

interface ServiceStats {
  serviceName: string;
  count: number;
  percentage: number;
}

@Component({
  standalone: false,
  selector: 'app-provider-analytics',
  templateUrl: './provider-analytics.component.html',
  styleUrls: ['./provider-analytics.component.scss']
})
export class ProviderAnalyticsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  
  totalRevenue = 0;
  totalBookings = 0;
  completionRate = 0;
  averageRating = 4.5; // Placeholder
  
  monthlyData: MonthlyData[] = [];
  serviceStats: ServiceStats[] = [];
  
  statusDistribution = {
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.calculateAnalytics();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateAnalytics(): void {
    // Total stats
    this.totalBookings = this.bookings.length;
    this.totalRevenue = this.bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    // Completion rate
    const completed = this.bookings.filter(b => b.status === 'completed').length;
    this.completionRate = this.totalBookings > 0 
      ? Math.round((completed / this.totalBookings) * 100) 
      : 0;

    // Status distribution
    this.statusDistribution = {
      pending: this.bookings.filter(b => b.status === 'pending').length,
      confirmed: this.bookings.filter(b => b.status === 'confirmed').length,
      inProgress: this.bookings.filter(b => b.status === 'in-progress').length,
      completed: this.bookings.filter(b => b.status === 'completed').length,
      cancelled: this.bookings.filter(b => b.status === 'cancelled').length
    };

    // Calculate monthly data (last 6 months)
    this.calculateMonthlyData();
    
    // Calculate service statistics
    this.calculateServiceStats();
  }

  calculateMonthlyData(): void {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, { bookings: number; revenue: number }>();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyMap.set(key, { bookings: 0, revenue: 0 });
    }

    // Populate with actual data
    this.bookings.forEach(booking => {
      const date = new Date(booking.scheduledDate);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (monthlyMap.has(key)) {
        const data = monthlyMap.get(key)!;
        data.bookings++;
        if (booking.status === 'completed') {
          data.revenue += booking.totalAmount || 0;
        }
      }
    });

    this.monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      bookings: data.bookings,
      revenue: data.revenue
    }));
  }

  calculateServiceStats(): void {
    const serviceMap = new Map<string, number>();

    this.bookings.forEach(booking => {
      const serviceName = typeof booking.service === 'object' 
        ? booking.service.name 
        : 'Unknown';
      
      serviceMap.set(serviceName, (serviceMap.get(serviceName) || 0) + 1);
    });

    const total = this.bookings.length || 1;
    this.serviceStats = Array.from(serviceMap.entries())
      .map(([serviceName, count]) => ({
        serviceName,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 services
  }

  getStatusPercentage(status: keyof typeof this.statusDistribution): number {
    const total = this.totalBookings || 1;
    return Math.round((this.statusDistribution[status] / total) * 100);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
