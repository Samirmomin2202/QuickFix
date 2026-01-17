import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@core/services/user.service';
import { FormControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-assign-provider-dialog',
  templateUrl: './assign-provider-dialog.component.html',
  styleUrls: ['./assign-provider-dialog.component.scss']
})
export class AssignProviderDialogComponent implements OnInit {
  providers: any[] = [];
  filteredProviders: any[] = [];
  loading = true;
  searchControl = new FormControl('');
  selectedProvider: any = null;

  constructor(
    public dialogRef: MatDialogRef<AssignProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: any },
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.filterProviders(searchTerm || '');
    });
  }

  loadProviders(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.providers = (response.data || []).filter((u: any) => u.role === 'service-provider');
        this.filteredProviders = [...this.providers];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.loading = false;
      }
    });
  }

  filterProviders(searchTerm: string): void {
    const search = searchTerm.toLowerCase();
    this.filteredProviders = this.providers.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.email.toLowerCase().includes(search)
    );
  }

  selectProvider(provider: any): void {
    this.selectedProvider = provider;
  }

  onAssign(): void {
    if (this.selectedProvider) {
      this.dialogRef.close(this.selectedProvider);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
