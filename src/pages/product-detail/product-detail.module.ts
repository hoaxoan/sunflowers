import { OverlayingViewComponentModule } from '../../components/overlaying-view/overlaying-view.module';
import { TimerComponentModule } from '../../components/timer/timer.module';
import { SharedModule } from '../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailPage } from './product-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailPage),
    TranslateModule.forChild(),
    TimerComponentModule,
    OverlayingViewComponentModule,
    SharedModule,
  ],
  exports: [
    ProductDetailPage
  ]
})
export class ProductDtailPageModule {}
