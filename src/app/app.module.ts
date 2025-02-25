import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';

import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './translations/transloco-root.module';
import { TranslationsModule } from './translations/translations.module';
import { SharedModule } from './shared/shared.module';
import { TranslocoService } from '@ngneat/transloco';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    HttpClientModule,
    TranslocoRootModule,
    TranslationsModule,
    SharedModule,
    AuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
