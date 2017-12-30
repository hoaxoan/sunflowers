import { OverlayingViewComponentModule } from '../../components/overlaying-view/overlaying-view.module';
import { TimerComponentModule } from '../../components/timer/timer.module';
import { SharedModule } from '../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderEditPage } from './order-edit';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderEditPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderEditPage),
    TranslateModule.forChild(),
    TimerComponentModule,
    OverlayingViewComponentModule,
    SharedModule,
  ],
  exports: [
    OrderEditPage
  ]
})
export class OrderEditPageModule {}
