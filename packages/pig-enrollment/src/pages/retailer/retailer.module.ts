import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RetailerPage } from './retailer';

@NgModule({
  declarations: [
    RetailerPage,
  ],
  imports: [
    IonicModule.forRoot(RetailerPage),
  ],
  exports: [
    RetailerPage
  ]
})
export class RetailerPageModule {}
