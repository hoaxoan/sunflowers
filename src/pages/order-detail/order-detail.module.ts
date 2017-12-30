import { OverlayingViewComponentModule } from '../../components/overlaying-view/overlaying-view.module';
import { TimerComponentModule } from '../../components/timer/timer.module';
import { SharedModule } from '../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailPage } from './order-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailPage),
    TranslateModule.forChild(),
    TimerComponentModule,
    OverlayingViewComponentModule,
    SharedModule,
  ],
  exports: [
    OrderDetailPage
  ]
})
export class OrderDetailPageModule {}
