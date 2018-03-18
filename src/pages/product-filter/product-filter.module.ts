import { SharedModule } from '../../app/shared.module';
import { ProductFilterPage } from './product-filter';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ProductFilterPage],
    imports: [
        IonicPageModule.forChild(ProductFilterPage),
        TranslateModule.forChild(),
        SharedModule,
    ]
})

export class ProductFilterPageModule { };
