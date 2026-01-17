import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-booking-details-dialog',
  templateUrl: './booking-details-dialog.component.html',
  styleUrls: ['./booking-details-dialog.component.scss']
})
export class BookingDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: any }
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
      'cancelled': '#6c757d'
    };
    return colors[status] || '#6c757d';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
