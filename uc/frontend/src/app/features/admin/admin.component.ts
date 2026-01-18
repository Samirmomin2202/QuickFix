import { Component, OnInit } from '@angular/core';
import { ServiceService } from '@core/services/service.service';
import { BookingService } from '@core/services/booking.service';
import { CategoryService } from '@core/services/category.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  standalone: false,
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

  trends = {
    revenue: 0,
    bookings: 0,
    services: 0,
    users: 0
  };

  recentActivities: any[] = [];
  chartData: number[] = [];
  chartLabels: string[] = [];

  loading = true;

  constructor(
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Initialize with 12 days of empty data
    this.chartLabels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (11 - i));
      return `Day ${date.getDate()}`;
    });
    this.chartData = new Array(12).fill(0);
    
    this.loadStats();
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
  }

  generateChartData(bookings: any[]): void {
    // Generate revenue chart for last 12 days
    const chartData: number[] = [];
    const chartLabels: string[] = [];
    const today = new Date();
    
    console.log('=== Generating Chart Data ===');
    console.log('Total bookings received:', bookings.length);
    console.log('Sample booking:', bookings[0]);
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayBookings = bookings.filter((b: any) => {
        const bookingDate = new Date(b.scheduledDate || b.createdAt);
        return bookingDate >= date && bookingDate < nextDate && b.status !== 'cancelled';
      });
      
      const dayRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
      
      // Format date as "Day DD" (e.g., "Day 1", "Day 16")
      const dayLabel = `Day ${date.getDate()}`;
      
      console.log(`${dayLabel}: ${date.toDateString()} - Bookings: ${dayBookings.length}, Revenue: ₹${dayRevenue}`);
      chartData.push(dayRevenue);
      chartLabels.push(dayLabel);
    }
    
    this.chartData = chartData;
    this.chartLabels = chartLabels;
    console.log('Chart Data Array:', this.chartData);
    console.log('Chart Labels:', this.chartLabels);
    console.log('Has data?', !this.hasNoChartData());
    console.log('Max value:', Math.max(...this.chartData));
    console.log('=== Chart Data Generation Complete ===');
  }

  sortActivities(): void {
    this.recentActivities.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    // Keep only top 5 most recent
    this.recentActivities = this.recentActivities.slice(0, 5);
  }

  getChartHeight(value: number): string {
    if (this.chartData.length === 0) return '5%';
    
    const maxValue = Math.max(...this.chartData);
    
    // If all values are 0 or there's no data, show placeholder bars
    if (maxValue === 0) {
      return '10%'; // Placeholder height when no data
    }
    
    // Calculate percentage with minimum 15% height for visibility
    const percentage = (value / maxValue) * 100;
    const finalHeight = Math.max(percentage, value > 0 ? 15 : 8);
    
    return `${finalHeight}%`;
  }

  hasNoChartData(): boolean {
    if (this.chartData.length === 0) return true;
    const hasData = this.chartData.some(d => d > 0);
    console.log('hasNoChartData check:', { 
      length: this.chartData.length, 
      hasData, 
      data: this.chartData 
    });
    return !hasData;
  }

  loadStats(): void {
    // Load users count
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        const users = response.data || [];
        this.stats.totalUsers = users.length;
        // Calculate trend (mock calculation - you can enhance with historical data)
        this.trends.users = 12.5;
        
        // Add recent user registrations to activities
        const recentUsers = users
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        recentUsers.forEach((user: any) => {
          this.recentActivities.push({
            type: 'user',
            icon: 'person_add',
            iconColor: 'green',
            title: 'New User Registration',
            subtitle: user.name || user.email,
            time: this.getTimeAgo(user.createdAt),
            timestamp: new Date(user.createdAt)
          });
        });
        
        this.sortActivities();
      }
    });

    // Load services count
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.stats.totalServices = response.data?.length || 0;
        // Calculate trend
        this.trends.services = 8.3;
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

        // Calculate trends (mock - enhance with historical data)
        this.trends.revenue = 15.8;
        this.trends.bookings = 10.2;
        
        // Generate chart data for last 12 periods (days/weeks)
        this.generateChartData(bookings);
        
        // Add recent bookings to activities
        const recentBookings = bookings
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        recentBookings.forEach((booking: any) => {
          const activity: any = {
            type: 'booking',
            timestamp: new Date(booking.createdAt),
            time: this.getTimeAgo(booking.createdAt)
          };
          
          if (booking.status === 'completed') {
            activity.icon = 'check_circle';
            activity.iconColor = 'green';
            activity.title = 'Booking Completed';
            activity.subtitle = booking.service?.name || 'Service';
            activity.value = `₹${booking.totalAmount?.toLocaleString() || 0}`;
          } else if (booking.status === 'cancelled') {
            activity.icon = 'cancel';
            activity.iconColor = 'red';
            activity.title = 'Booking Cancelled';
            activity.subtitle = booking.service?.name || 'Service';
          } else {
            activity.icon = 'book_online';
            activity.iconColor = 'blue';
            activity.title = 'New Booking';
            activity.subtitle = booking.service?.name || 'Service';
            activity.value = `₹${booking.totalAmount?.toLocaleString() || 0}`;
          }
          
          this.recentActivities.push(activity);
        });
        
        this.sortActivities();
        this.loading = false;
      }
    });
  }
}