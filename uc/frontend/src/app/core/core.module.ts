import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// This module should be imported only once in AppModule
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only once in AppModule.');
    }
  }
}
