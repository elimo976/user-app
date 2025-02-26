import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

import {DialogModule} from 'primeng/dialog';
import { Button } from 'primeng/button';

import {AgGridModule} from 'ag-grid-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslationsModule } from '../translations/translations.module';
import { UserActionRendererComponent } from './user-action-renderer/user-action-renderer.component';


@NgModule({
  declarations: [
    UsersListComponent,
    UserDetailComponent,
    UserFormComponent,
    UserActionRendererComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    DialogModule,
    Button,
    TranslocoModule,
    TranslationsModule,
    AgGridModule
  ]
})
export class UsersModule { }
