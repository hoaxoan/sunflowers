import { SharedModule } from '../../app/shared.module';
import { ProductPage } from './product';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ProductPage],
    imports: [
        IonicPageModule.forChild(ProductPage),
        TranslateModule.forChild(),
        SharedModule,
    ]
})

export class ProductPageModule { };
