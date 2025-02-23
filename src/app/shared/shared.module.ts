import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';

import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslationsModule } from '../translations/translations.module';



@NgModule({
  declarations: [
    LanguageSwitcherComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TranslocoModule,
    TranslationsModule
  ],
  exports: [
    LanguageSwitcherComponent,
    DropdownModule,
    FormsModule,
    HeaderComponent
  ]
})
export class SharedModule { }
