import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: ':id',
    component: ServiceDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
