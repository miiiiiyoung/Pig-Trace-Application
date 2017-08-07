import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ButcheryPage } from './butchery';

@NgModule({
  declarations: [
    ButcheryPage,
  ],
  imports: [
    IonicModule.forRoot(ButcheryPage),
  ],
  exports: [
    ButcheryPage
  ]
})
export class ButcheryPageModule {}
