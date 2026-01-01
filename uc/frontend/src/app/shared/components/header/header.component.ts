import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-header',
  template: `
    <mat-toolbar class="header">
      <div class="header-container">
        <div class="logo" routerLink="/">
          <img src="assets/images/quickfix-logo.jpg" alt="QuickFix Logo" class="logo-img">
          <h1>QuickFix</h1>
        </div>

        <nav class="nav-menu">
          <button mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            Home
          </button>
          <button mat-button routerLink="/services" routerLinkActive="active">
            Services
          </button>
          <button mat-button routerLink="/about" routerLinkActive="active">
            About Us
          </button>
          <button mat-button routerLink="/contact" routerLinkActive="active">
            Contact
          </button>
        </nav>

        <div class="header-actions">
          <ng-container *ngIf="currentUser$ | async as user; else loginButton">
            <button mat-button routerLink="/bookings" routerLinkActive="active">
              <mat-icon>book_online</mat-icon>
              My Bookings
            </button>
            
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <div class="user-info" mat-menu-item disabled>
                <strong>{{ user.name }}</strong>
                <small>{{ user.email }}</small>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                Profile
              </button>
              <button mat-menu-item *ngIf="user.role === 'admin'" routerLink="/admin">
                <mat-icon>admin_panel_settings</mat-icon>
                Admin Panel
              </button>
              <button mat-menu-item *ngIf="user.role === 'service-provider'" routerLink="/provider">
                <mat-icon>work</mat-icon>
                Provider Dashboard
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                Logout
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #loginButton>
            <button mat-raised-button color="primary" routerLink="/auth/login">
              Login
            </button>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: 70px;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 20px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;

      .logo-img {
        height: 40px;
        width: auto;
        object-fit: contain;
      }

      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #6e45e2;
      }
    }

    .nav-menu {
      display: flex;
      gap: 10px;

      button.active {
        color: #6e45e2;
        font-weight: 600;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      padding: 8px 16px;

      strong {
        font-size: 14px;
      }

      small {
        font-size: 12px;
        color: #666;
      }
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .logo h1 {
        font-size: 20px;
      }
    }
  `]
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
