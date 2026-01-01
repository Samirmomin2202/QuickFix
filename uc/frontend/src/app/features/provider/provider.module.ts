import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderDashboardComponent } from './provider-dashboard/provider-dashboard.component';

@NgModule({
  declarations: [
    ProviderDashboardComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class ProviderModule { }
