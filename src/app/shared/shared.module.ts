import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';

import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslationsModule } from '../translations/translations.module';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    LanguageSwitcherComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    TranslocoModule,
    TranslationsModule,
    MenuModule,
    ReactiveFormsModule
  ],
  exports: [
    LanguageSwitcherComponent,
    TranslationsModule,
    TranslocoModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Per i Web Component
})
export class SharedModule { }
