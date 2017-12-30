import { SharedModule } from '../../app/shared.module';
import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [HomePage],
    imports: [
        IonicPageModule.forChild(HomePage),
        TranslateModule.forChild(),
        SharedModule,
    ]
})

export class HomePageModule { };
