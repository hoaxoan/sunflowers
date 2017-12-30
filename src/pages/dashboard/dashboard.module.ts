import { SharedModule } from '../../app/shared.module';
import { DashboardPage } from './dashboard';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [DashboardPage],
    imports: [
        IonicPageModule.forChild(DashboardPage),
        TranslateModule.forChild(),
        SharedModule,
    ],
    exports: [
        DashboardPage
    ]
})

export class DashbardPageModule { };
