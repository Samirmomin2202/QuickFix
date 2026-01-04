import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '@core/services/profile.service';
import { User, Profile } from '@core/models';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

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
            
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-avatar-btn">
              <img 
                *ngIf="userProfileImage; else defaultAvatar" 
                [src]="userProfileImage" 
                alt="Profile" 
                class="user-avatar-img">
              <ng-template #defaultAvatar>
                <mat-icon>account_circle</mat-icon>
              </ng-template>
            </button>
            
            <mat-menu #userMenu="matMenu" class="user-menu-panel">
              <div class="user-info-header">
                <div class="user-avatar">
                  <img 
                    *ngIf="userProfileImage; else menuDefaultAvatar" 
                    [src]="userProfileImage" 
                    alt="Profile" 
                    class="menu-avatar-img">
                  <ng-template #menuDefaultAvatar>
                    <mat-icon>account_circle</mat-icon>
                  </ng-template>
                </div>
                <div class="user-details">
                  <strong class="user-name">{{ user.name }}</strong>
                  <small class="user-email">{{ user.email }}</small>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item routerLink="/bookings">
                <mat-icon>book_online</mat-icon>
                <span>My Bookings</span>
              </button>
              <button mat-menu-item *ngIf="user.role === 'admin'" routerLink="/admin">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Admin Panel</span>
              </button>
              <button mat-menu-item *ngIf="user.role === 'service-provider'" routerLink="/provider">
                <mat-icon>work</mat-icon>
                <span>Provider Dashboard</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="logout-btn">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #loginButton>
            <button mat-raised-button color="accent" routerLink="/auth/register" class="get-started-btn">
              Get Started
            </button>
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
      gap: 12px;

      .user-avatar-btn {
        ::ng-deep .mat-mdc-button-persistent-ripple {
          border-radius: 50%;
        }

        .user-avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #667eea;
        }
      }

      .get-started-btn {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }
      }
    }

    ::ng-deep .user-menu-panel {
      margin-top: 8px;
      min-width: 280px;

      .mat-mdc-menu-content {
        padding: 0 !important;
      }

      .user-info-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%);
        color: white;
        margin-bottom: 8px;

        .user-avatar {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);

          mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            color: white;
            padding: 4px;
          }
        }

        .menu-avatar-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .user-name {
            font-size: 16px;
            font-weight: 600;
            color: white;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-email {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      button.mat-mdc-menu-item {
        min-height: 48px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f5f5;
        }

        mat-icon {
          color: #666;
          font-size: 22px;
          width: 22px;
          height: 22px;
        }

        span {
          flex: 1;
          font-size: 14px;
          color: #333;
        }

        &.logout-btn {
          mat-icon {
            color: #ef4444;
          }

          span {
            color: #ef4444;
          }

          &:hover {
            background-color: #fee;
          }
        }
      }

      mat-divider {
        margin: 8px 0;
      }
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
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  userProfileImage: string | null = null;
  private uploadsUrl = environment.uploadsUrl;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Load profile image when user logs in
    this.currentUser$.subscribe(user => {
      if (user) {
        this.loadProfileImage();
      } else {
        this.userProfileImage = null;
      }
    });

    // Listen for profile image updates (real-time)
    this.profileService.profileImageUpdated$.subscribe((imageFileName) => {
      if (imageFileName && imageFileName !== 'default-avatar.png') {
        this.userProfileImage = `${this.uploadsUrl}/profiles/${imageFileName}`;
      } else {
        this.userProfileImage = null;
      }
    });
  }

  loadProfileImage(): void {
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        if (response.data?.profileImage && response.data.profileImage !== 'default-avatar.png') {
          this.userProfileImage = `${this.uploadsUrl}/profiles/${response.data.profileImage}`;
        } else {
          this.userProfileImage = null;
        }
      },
      error: () => {
        this.userProfileImage = null;
      }
    });
  }

  logout(): void {
    this.userProfileImage = null;
    this.authService.logout();
  }
}
