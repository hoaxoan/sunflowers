import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorldMapPage } from './world-map';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WorldMapPage,
  ],
  imports: [
    IonicPageModule.forChild(WorldMapPage),
    TranslateModule.forChild(),
  ],
  exports: [
    WorldMapPage
  ]
})
export class WorldMapPageModule {}
