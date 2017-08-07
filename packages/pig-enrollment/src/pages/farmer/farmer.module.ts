import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FarmerPage } from './farmer';

@NgModule({
  declarations: [
    FarmerPage,
  ],
  imports: [
    IonicModule.forRoot(FarmerPage),
  ],
  exports: [
    FarmerPage
  ]
})
export class FarmerPageModule {}
