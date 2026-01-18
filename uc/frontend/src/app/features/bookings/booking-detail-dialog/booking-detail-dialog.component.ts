import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-booking-detail-dialog',
  templateUrl: './booking-detail-dialog.component.html',
  styleUrls: ['./booking-detail-dialog.component.scss']
})
export class BookingDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: any },
    private snackBar: MatSnackBar
  ) {}

  get booking() {
    return this.data.booking;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': '#fbbf24',
      'confirmed': '#3b82f6',
      'in-progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#6c757d';
  }

  getPaymentStatusColor(status: string): string {
    const colors: any = {
      'pending': '#fbbf24',
      'paid': '#10b981',
      'failed': '#ef4444',
      'refunded': '#6b7280'
    };
    return colors[status] || '#6c757d';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }

  contactProvider(): void {
    if (this.booking.serviceProvider) {
      const provider = this.booking.serviceProvider;
      const subject = encodeURIComponent(`Regarding Booking #${this.booking._id}`);
      const body = encodeURIComponent(
        `Hello ${provider.name},\n\n` +
        `I would like to discuss my booking:\n` +
        `Service: ${this.booking.service?.name}\n` +
        `Scheduled Date: ${new Date(this.booking.scheduledDate).toLocaleDateString()}\n` +
        `Time: ${this.booking.scheduledTime}\n\n` +
        `Best regards`
      );
      
      window.location.href = `mailto:${provider.email}?subject=${subject}&body=${body}`;
    }
  }

  callProvider(): void {
    if (this.booking.serviceProvider?.phone) {
      window.location.href = `tel:${this.booking.serviceProvider.phone}`;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
