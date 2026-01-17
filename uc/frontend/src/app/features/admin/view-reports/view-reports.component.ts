import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { ServiceService } from '@core/services/service.service';

interface MonthlyData {
  month: string;
  bookings: number;
  revenue: number;
}

@Component({
  standalone: false,
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

  monthlyData: MonthlyData[] = [];

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
        
        // Calculate monthly data
        this.calculateMonthlyData(bookings);
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

  calculateMonthlyData(bookings: any[]): void {
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
    bookings.forEach((booking: any) => {
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

  getStatusPercentage(status: keyof typeof this.reportData.bookingsByStatus): number {
    const total = this.reportData.totalBookings || 1;
    return Math.round((this.reportData.bookingsByStatus[status] / total) * 100);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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
