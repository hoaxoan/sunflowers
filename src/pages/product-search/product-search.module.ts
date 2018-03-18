import { SharedModule } from '../../app/shared.module';
import { ProductSearchPage } from './product-search';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ProductSearchPage],
    imports: [
        IonicPageModule.forChild(ProductSearchPage),
        TranslateModule.forChild(),
        SharedModule,
    ]
})

export class ProductSearchPageModule { };
