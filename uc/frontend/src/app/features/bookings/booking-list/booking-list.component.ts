import { Component, OnInit } from '@angular/core';
import { BookingService } from '@core/services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { BookingDetailDialogComponent } from '../booking-detail-dialog/booking-detail-dialog.component';

@Component({
  standalone: false,
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  loading = true;
  filterStatus: string = 'all';
  searchTerm: string = '';
  sortBy: string = 'date-desc';

  statusOptions = [
    { value: 'all', label: 'All Bookings', count: 0 },
    { value: 'pending', label: 'Pending', count: 0 },
    { value: 'confirmed', label: 'Confirmed', count: 0 },
    { value: 'in-progress', label: 'In Progress', count: 0 },
    { value: 'completed', label: 'Completed', count: 0 },
    { value: 'cancelled', label: 'Cancelled', count: 0 }
  ];

  sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' }
  ];

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.data || [];
        this.updateStatusCounts();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Failed to load bookings', 'error');
      }
    });
  }

  updateStatusCounts(): void {
    this.statusOptions.forEach(option => {
      if (option.value === 'all') {
        option.count = this.bookings.length;
      } else {
        option.count = this.bookings.filter(b => b.status === option.value).length;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.bookings];

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.service?.name?.toLowerCase().includes(term) ||
        b.address?.city?.toLowerCase().includes(term) ||
        b.status?.toLowerCase().includes(term)
      );
    }

    // Sort
    this.sortBookings(filtered);
    
    this.filteredBookings = filtered;
  }

  sortBookings(bookings: any[]): void {
    bookings.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return 0;
      }
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterStatus = 'all';
    this.searchTerm = '';
    this.sortBy = 'date-desc';
    this.applyFilters();
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
      'pending': '#fbbf24',
      'paid': '#10b981',
      'failed': '#ef4444',
      'cancelled': '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  viewDetails(booking: any): void {
    this.dialog.open(BookingDetailDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { booking }
    });
  }

  contactProvider(booking: any): void {
    if (!booking.serviceProvider) {
      this.showMessage('No provider assigned to this booking yet', 'error');
      return;
    }

    const provider = booking.serviceProvider;
    const subject = encodeURIComponent(`Regarding Booking #${booking._id}`);
    const body = encodeURIComponent(
      `Hello ${provider.name},\n\n` +
      `I would like to discuss my booking:\n` +
      `Service: ${booking.service?.name}\n` +
      `Scheduled Date: ${new Date(booking.scheduledDate).toLocaleDateString()}\n` +
      `Time: ${booking.scheduledTime}\n\n` +
      `Best regards`
    );
    
    window.location.href = `mailto:${provider.email}?subject=${subject}&body=${body}`;
  }

  cancelBooking(booking: any): void {
    if (confirm(`Are you sure you want to cancel booking for "${booking.service?.name}"?`)) {
      this.bookingService.cancelBooking(booking._id).subscribe({
        next: () => {
          this.showMessage('Booking cancelled successfully', 'success');
          this.loadBookings();
        },
        error: (error) => {
          this.showMessage('Error cancelling booking', 'error');
        }
      });
    }
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return past.toLocaleDateString();
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
