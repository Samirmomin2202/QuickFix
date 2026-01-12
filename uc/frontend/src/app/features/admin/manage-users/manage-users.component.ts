import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  approvalStatus?: string;
  isApproved?: boolean;
}

@Component({
  standalone: false,
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: UserData[] = [];
  loading = true;
  filterRole: string = 'all';
  searchTerm: string = '';
  selectedUser: UserData | null = null;
  showUserDetails = false;
  isEditing = false;
  editUserData: any = {};
  currentUserId: string = '';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = currentUser._id || currentUser.id || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showMessage('Failed to load users', 'error');
        this.loading = false;
      }
    });
  }

  get filteredUsers(): UserData[] {
    let filtered = this.users;
    
    // Filter by role
    if (this.filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }
    
    // Filter by search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.phone.includes(search)
      );
    }
    
    return filtered;
  }

  get pendingProvidersCount(): number {
    return this.users.filter(u => 
      u.role === 'service-provider' && u.approvalStatus === 'pending'
    ).length;
  }

  getApprovalStatus(user: UserData): string {
    if (user.approvalStatus === 'pending') return 'Pending Approval';
    if (user.approvalStatus === 'approved') return 'Approved';
    if (user.approvalStatus === 'rejected') return 'Rejected';
    return 'Unknown';
  }

  getApprovalIcon(user: UserData): string {
    if (user.approvalStatus === 'pending') return 'hourglass_empty';
    if (user.approvalStatus === 'approved') return 'verified';
    if (user.approvalStatus === 'rejected') return 'cancel';
    return 'help';
  }

  approveProvider(user: UserData): void {
    if (confirm(`Approve ${user.name} as a service provider? They will receive an email notification.`)) {
      this.userService.approveProvider(user._id).subscribe({
        next: (response) => {
          this.showMessage('Provider approved successfully. Email sent.', 'success');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error approving provider:', error);
          this.showMessage('Failed to approve provider', 'error');
        }
      });
    }
  }

  rejectProvider(user: UserData): void {
    const reason = prompt('Optional: Provide a reason for rejection');
    if (reason !== null) { // null means cancelled
      this.userService.rejectProvider(user._id, reason).subscribe({
        next: (response) => {
          this.showMessage('Provider rejected. Email sent.', 'success');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error rejecting provider:', error);
          this.showMessage('Failed to reject provider', 'error');
        }
      });
    }
  }

  getRoleBadgeColor(role: string): string {
    const colors: any = {
      'admin': 'warn',
      'service-provider': 'primary',
      'user': 'accent'
    };
    return colors[role] || '';
  }

  viewUserDetails(user: UserData): void {
    this.selectedUser = user;
    this.showUserDetails = true;
    this.isEditing = false;
  }

  closeUserDetails(): void {
    this.showUserDetails = false;
    this.selectedUser = null;
    this.isEditing = false;
    this.editUserData = {};
  }

  editUser(user: UserData): void {
    this.selectedUser = user;
    this.editUserData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive
    };
    this.isEditing = true;
    this.showUserDetails = true;
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;
    
    this.userService.updateUser(this.selectedUser._id, this.editUserData).subscribe({
      next: (response) => {
        this.showMessage('User updated successfully', 'success');
        this.loadUsers();
        this.closeUserDetails();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.showMessage('Failed to update user', 'error');
      }
    });
  }

  canDeleteUser(user: UserData): boolean {
    return user._id !== this.currentUserId;
  }

  canChangeUserStatus(user: UserData): boolean {
    return user._id !== this.currentUserId;
  }

  toggleUserStatus(user: UserData): void {
    if (user._id === this.currentUserId) {
      this.showMessage('You cannot deactivate your own account', 'error');
      return;
    }

    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      this.userService.updateUser(user._id, { isActive: newStatus }).subscribe({
        next: (response) => {
          this.showMessage(`User ${action}d successfully`, 'success');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.showMessage('Failed to update user status', 'error');
        }
      });
    }
  }

  deleteUser(user: UserData): void {
    if (user._id === this.currentUserId) {
      this.showMessage('You cannot delete your own account', 'error');
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: (response) => {
          this.showMessage('User deleted successfully', 'success');
          this.loadUsers();
          if (this.selectedUser?._id === user._id) {
            this.closeUserDetails();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showMessage('Failed to delete user', 'error');
        }
      });
    }
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
