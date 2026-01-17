import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { UserService } from '@core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { AssignProviderDialogComponent } from './assign-provider-dialog/assign-provider-dialog.component';
import { BookingDetailsDialogComponent } from './booking-details-dialog/booking-details-dialog.component';

interface BookingData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    _id: string;
    name: string;
    price: number;
  };
  serviceProvider?: {
    _id: string;
    name: string;
    email: string;
  };
  scheduledDate: Date;
  scheduledTime: string;
  status: string;
  totalAmount: number;
  paymentStatus?: string;
  address: any;
  description?: string;
  createdAt: Date;
}

@Component({
  standalone: false,
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})
export class ManageBookingsComponent implements OnInit {
  bookings: BookingData[] = [];
  loading = true;
  filterStatus: string = 'all';
  filterPayment: string = 'all';
  searchTerm: string = '';
  selectedDate: string = 'all';
  showFilters: boolean = true;

  dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  paymentOptions = [
    { value: 'all', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.showMessage('Failed to load bookings', 'error');
        this.loading = false;
      }
    });
  }

  get filteredBookings(): BookingData[] {
    let filtered = this.bookings;
    
    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }
    
    // Filter by payment status
    if (this.filterPayment !== 'all') {
      filtered = filtered.filter(b => b.paymentStatus === this.filterPayment);
    }

    // Filter by date range
    if (this.selectedDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.scheduledDate);
        bookingDate.setHours(0, 0, 0, 0);
        
        if (this.selectedDate === 'today') {
          return bookingDate.getTime() === today.getTime();
        } else if (this.selectedDate === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return bookingDate >= weekAgo;
        } else if (this.selectedDate === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return bookingDate >= monthAgo;
        }
        return true;
      });
    }
    
    // Filter by search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.user?.name?.toLowerCase().includes(search) ||
        b.user?.email?.toLowerCase().includes(search) ||
        b.service?.name?.toLowerCase().includes(search) ||
        b._id.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  get statusCounts(): { [key: string]: number } {
    return {
      all: this.bookings.length,
      pending: this.bookings.filter(b => b.status === 'pending').length,
      confirmed: this.bookings.filter(b => b.status === 'confirmed').length,
      'in-progress': this.bookings.filter(b => b.status === 'in-progress').length,
      completed: this.bookings.filter(b => b.status === 'completed').length,
      cancelled: this.bookings.filter(b => b.status === 'cancelled').length
    };
  }

  get paymentCounts(): { [key: string]: number } {
    return {
      all: this.bookings.length,
      pending: this.bookings.filter(b => b.paymentStatus === 'pending').length,
      paid: this.bookings.filter(b => b.paymentStatus === 'paid').length,
      failed: this.bookings.filter(b => b.paymentStatus === 'failed').length,
      cancelled: this.bookings.filter(b => b.paymentStatus === 'cancelled').length
    };
  }

  get totalRevenue(): number {
    return this.bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }

  get pendingRevenue(): number {
    return this.bookings
      .filter(b => b.paymentStatus === 'pending')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }

  get todayBookings(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.bookings.filter(b => {
      const bookingDate = new Date(b.scheduledDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    }).length;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warn',
      'confirmed': 'primary',
      'in-progress': 'accent',
      'completed': 'primary',
      'cancelled': ''
    };
    return colors[status] || '';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'pending': 'schedule',
      'confirmed': 'check_circle',
      'in-progress': 'cached',
      'completed': 'done_all',
      'cancelled': 'cancel'
    };
    return icons[status] || 'help';
  }

  getPaymentStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warn',
      'paid': 'primary',
      'failed': '',
      'cancelled': ''
    };
    return colors[status] || '';
  }

  getPaymentStatusIcon(status: string): string {
    const icons: any = {
      'pending': 'hourglass_empty',
      'paid': 'check_circle',
      'failed': 'error',
      'cancelled': 'cancel'
    };
    return icons[status] || 'help';
  }

  updateBookingStatus(booking: BookingData, newStatus: string): void {
    if (confirm(`Change booking status to "${newStatus}"?`)) {
      this.bookingService.updateBooking(booking._id, { status: newStatus as any }).subscribe({
        next: () => {
          this.showMessage('Booking status updated successfully', 'success');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error updating booking:', error);
          this.showMessage('Failed to update booking status', 'error');
        }
      });
    }
  }

  updatePaymentStatus(booking: BookingData, newPaymentStatus: string): void {
    if (confirm(`Change payment status to "${newPaymentStatus}"?`)) {
      this.bookingService.updateBooking(booking._id, { paymentStatus: newPaymentStatus as any }).subscribe({
        next: () => {
          this.showMessage('Payment status updated successfully', 'success');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
          this.showMessage('Failed to update payment status', 'error');
        }
      });
    }
  }

  viewBookingDetails(booking: BookingData): void {
    this.dialog.open(BookingDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { booking }
    });
  }

  deleteBooking(booking: BookingData): void {
    if (confirm(`Are you sure you want to delete booking #${booking._id}? This action cannot be undone.`)) {
      this.bookingService.deleteBooking(booking._id).subscribe({
        next: () => {
          this.showMessage('Booking deleted successfully', 'success');
          this.loadBookings();
        },
        error: (error: any) => {
          console.error('Error deleting booking:', error);
          this.showMessage('Failed to delete booking', 'error');
        }
      });
    }
  }

  assignProvider(booking: BookingData): void {
    const dialogRef = this.dialog.open(AssignProviderDialogComponent, {
      width: '600px',
      data: { booking }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookingService.updateBooking(booking._id, { 
          serviceProvider: result._id 
        }).subscribe({
          next: () => {
            this.showMessage(`Provider ${result.name} assigned successfully`, 'success');
            this.loadBookings();
          },
          error: (error) => {
            console.error('Error assigning provider:', error);
            this.showMessage('Failed to assign provider', 'error');
          }
        });
      }
    });
  }

  contactCustomer(booking: BookingData): void {
    const subject = encodeURIComponent(`Regarding Booking #${booking._id}`);
    const body = encodeURIComponent(
      `Dear ${booking.user.name},\n\n` +
      `This is regarding your booking for ${booking.service.name}.\n` +
      `Booking ID: ${booking._id}\n` +
      `Scheduled Date: ${new Date(booking.scheduledDate).toLocaleDateString()}\n` +
      `Status: ${booking.status}\n\n` +
      `Best regards,\nQuickFix Team`
    );
    
    const mailtoLink = `mailto:${booking.user.email}?subject=${subject}&body=${body}`;
    
    // Open in new window to avoid navigation issues
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.click();
    
    this.showMessage(`Opening email client to contact ${booking.user.name}`, 'success');
  }

  exportBookings(): void {
    // TODO: Implement export functionality
    this.showMessage('Export feature coming soon', 'success');
  }

  refreshBookings(): void {
    this.loadBookings();
    this.showMessage('Bookings refreshed', 'success');
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filterStatus = 'all';
    this.filterPayment = 'all';
    this.selectedDate = 'all';
    this.searchTerm = '';
  }

  getStatusPercentage(status: string): number {
    if (this.bookings.length === 0) return 0;
    const count = this.bookings.filter(b => b.status === status).length;
    return Math.round((count / this.bookings.length) * 100);
  }

  getPaymentPercentage(status: string): number {
    if (this.bookings.length === 0) return 0;
    const count = this.bookings.filter(b => b.paymentStatus === status).length;
    return Math.round((count / this.bookings.length) * 100);
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
