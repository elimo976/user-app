import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoRootModule } from './transloco-root.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslocoRootModule
  ],
  exports: [ TranslocoRootModule]
})
export class TranslationsModule { }
