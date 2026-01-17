import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderDashboardComponent } from './provider-dashboard/provider-dashboard.component';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import { ProviderAnalyticsComponent } from './provider-analytics/provider-analytics.component';
import { ProviderBankDetailsComponent } from './provider-bank-details/provider-bank-details.component';

@NgModule({
  declarations: [
    ProviderDashboardComponent,
    ProviderProfileComponent,
    ProviderAnalyticsComponent,
    ProviderBankDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProviderRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule
  ]
})
export class ProviderModule { }
