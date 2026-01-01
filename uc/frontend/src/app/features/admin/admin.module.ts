import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddServiceComponent,
    ManageCategoriesComponent,
    ManageUsersComponent,
    ViewReportsComponent,
    ManageServicesComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
