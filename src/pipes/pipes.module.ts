import { RomanizePipe } from './romanize/romanize';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ RomanizePipe ],
  exports: [ RomanizePipe ]
})
export class PipesModule {}
