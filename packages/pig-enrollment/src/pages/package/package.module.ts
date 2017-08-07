import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PackagePage } from './package';

@NgModule({
  declarations: [
    PackagePage,
  ],
  imports: [
    IonicModule.forRoot(PackagePage),
  ],
  exports: [
    PackagePage
  ]
})
export class PackagePageModule {}
