import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'add-service',
    component: AddServiceComponent
  },
  {
    path: 'manage-services',
    component: ManageServicesComponent
  },
  {
    path: 'manage-categories',
    component: ManageCategoriesComponent
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent
  },
  {
    path: 'view-reports',
    component: ViewReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
