import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderDashboardComponent } from './provider-dashboard/provider-dashboard.component';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import { ProviderAnalyticsComponent } from './provider-analytics/provider-analytics.component';
import { ProviderBankDetailsComponent } from './provider-bank-details/provider-bank-details.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ProviderDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service-provider'] }
  },
  {
    path: 'profile',
    component: ProviderProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service-provider'] }
  },
  {
    path: 'analytics',
    component: ProviderAnalyticsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service-provider'] }
  },
  {
    path: 'bank-details',
    component: ProviderBankDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service-provider'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
