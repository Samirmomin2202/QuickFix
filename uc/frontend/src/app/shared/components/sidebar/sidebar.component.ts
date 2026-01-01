import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@core/models';
import { filter } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  template: `
    <ng-container *ngIf="shouldShowSidebar && (currentUser$ | async) as user">
      <div class="sidebar">
        <div class="sidebar-content" *ngIf="user.role === 'admin'">
          <div class="sidebar-header">
            <h3>Quick Actions</h3>
          </div>
          
          <nav class="sidebar-nav">
            <a mat-button routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            
            <a mat-button routerLink="/admin/add-service" routerLinkActive="active">
              <mat-icon>add_circle</mat-icon>
              <span>Add Service</span>
            </a>
            
            <a mat-button routerLink="/admin/manage-services" routerLinkActive="active">
              <mat-icon>design_services</mat-icon>
              <span>Manage Services</span>
            </a>
            
            <a mat-button routerLink="/admin/manage-categories" routerLinkActive="active">
              <mat-icon>category</mat-icon>
              <span>Manage Categories</span>
            </a>
            
            <a mat-button routerLink="/admin/manage-users" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              <span>Manage Users</span>
            </a>
            
            <a mat-button routerLink="/admin/view-reports" routerLinkActive="active">
              <mat-icon>assessment</mat-icon>
              <span>View Reports</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <button mat-button class="logout-btn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div class="sidebar-content" *ngIf="user.role === 'service-provider'">
          <div class="sidebar-header">
            <h3>Provider Menu</h3>
          </div>
          
          <nav class="sidebar-nav">
            <a mat-button routerLink="/provider/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            
            <a mat-button routerLink="/bookings" routerLinkActive="active">
              <mat-icon>book_online</mat-icon>
              <span>My Bookings</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <button mat-button class="logout-btn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 260px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e0e0e0;
      z-index: 100;
      overflow-y: auto;

      .sidebar-content {
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        height: 100%;

        .sidebar-header {
          padding: 0 20px 16px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 8px;

          h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 12px;

          a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: #666;
            transition: all 0.2s;
            width: 100%;
            justify-content: flex-start;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: #999;
            }

            span {
              font-size: 14px;
              font-weight: 500;
            }

            &:hover {
              background: #f5f5f5;
              color: #333;

              mat-icon {
                color: #6e45e2;
              }
            }

            &.active {
              background: #f0edff;
              color: #6e45e2;

              mat-icon {
                color: #6e45e2;
              }
            }
          }
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 12px;
          border-top: 1px solid #f0f0f0;

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            color: #d32f2f;
            transition: all 0.2s;
            width: 100%;
            justify-content: flex-start;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }

            span {
              font-size: 14px;
              font-weight: 500;
            }

            &:hover {
              background: #ffebee;
              color: #c62828;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
        
        &.open {
          transform: translateX(0);
        }
      }
    }
  `]
})
export class SidebarComponent {
  currentUser$: Observable<User | null>;
  shouldShowSidebar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
    });
  }

  private checkRoute(url: string): void {
    // Show sidebar only on admin and provider routes
    this.shouldShowSidebar = url.startsWith('/admin') || url.startsWith('/provider');
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
