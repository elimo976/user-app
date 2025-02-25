import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslationsModule } from '../translations/translations.module';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    TranslocoModule,
    TranslationsModule,
  ],
  exports: [
    TranslocoModule,
    TranslationsModule
  ],
})
export class AuthModule { }
