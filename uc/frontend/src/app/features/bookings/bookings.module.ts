import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingDetailDialogComponent } from './booking-detail-dialog/booking-detail-dialog.component';

const routes: Routes = [
  { path: '', component: BookingListComponent }
];

@NgModule({
  declarations: [
    BookingListComponent,
    BookingDetailDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BookingsModule { }
