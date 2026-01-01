import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <app-header *ngIf="!isAdminRoute"></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.with-sidebar]="shouldShowSidebar" [class.full-height]="isAdminRoute">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isAdminRoute"></app-footer>
    <app-loading></app-loading>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 140px);
      padding-top: 70px;
      transition: margin-left 0.3s;
    }

    .main-content.full-height {
      min-height: 100vh;
      padding-top: 0;
    }

    @media (min-width: 769px) {
      .main-content.with-sidebar {
        margin-left: 260px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'QuickFix';
  shouldShowSidebar = false;
  isAdminRoute = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load current user if token exists
    if (this.authService.isAuthenticated()) {
      this.authService.getMe().subscribe();
    }

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
    this.isAdminRoute = url.startsWith('/admin') || url.startsWith('/provider');
    this.shouldShowSidebar = this.isAdminRoute;
  }
}
