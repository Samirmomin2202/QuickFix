import { Component } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="loading$ | async">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class LoadingComponent {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
