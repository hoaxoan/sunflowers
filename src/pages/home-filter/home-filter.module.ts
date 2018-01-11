import { SharedModule } from '../../app/shared.module';
import { HomeFilterPage } from './home-filter';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [HomeFilterPage],
    imports: [
        IonicPageModule.forChild(HomeFilterPage),
        TranslateModule.forChild(),
        SharedModule,
    ]
})

export class HomeFilterPageModule { };
