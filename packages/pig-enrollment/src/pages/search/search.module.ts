import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SearchPage } from './search';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicModule.forRoot(SearchPage),
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule {}
