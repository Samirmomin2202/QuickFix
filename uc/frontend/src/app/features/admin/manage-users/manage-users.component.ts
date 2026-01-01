import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  get filteredUsers(): UserData[] {
    if (this.filterRole === 'all') {
      return this.users;
    }
    return this.users.filter(u => u.role === this.filterRole);
  }

  getRoleBadgeColor(role: string): string {
    const colors: any = {
      'admin': 'warn',
      'service-provider': 'primary',
      'user': 'accent'
    };
    return colors[role] || '';
  }

  toggleUserStatus(user: UserData): void {
    alert(`User "${user.name}" status would be changed to ${!user.isActive ? 'Active' : 'Inactive'}`);
  }
}
