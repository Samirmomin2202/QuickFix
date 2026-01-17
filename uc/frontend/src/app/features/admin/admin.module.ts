import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { AssignProviderDialogComponent } from './manage-bookings/assign-provider-dialog/assign-provider-dialog.component';
import { BookingDetailsDialogComponent } from './manage-bookings/booking-details-dialog/booking-details-dialog.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddServiceComponent,
    ManageCategoriesComponent,
    ManageUsersComponent,
    ViewReportsComponent,
    ManageServicesComponent,
    ManageBookingsComponent,
    AssignProviderDialogComponent,
    BookingDetailsDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
