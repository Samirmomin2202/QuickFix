import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { BookingListComponent } from './booking-list/booking-list.component';

const routes: Routes = [
  { path: '', component: BookingListComponent }
];

@NgModule({
  declarations: [
    BookingListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BookingsModule { }
