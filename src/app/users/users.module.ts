import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ReactiveFormsModule } from'@angular/forms';

import {DialogModule} from 'primeng/dialog';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'

import {AgGridModule} from 'ag-grid-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslationsModule } from '../translations/translations.module';
import { UserActionRendererComponent } from './user-action-renderer/user-action-renderer.component';
import { SharedModule } from '../shared/shared.module';


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
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    Button,
    DropdownModule,
    TranslocoModule,
    TranslationsModule,
    AgGridModule,
    SharedModule
  ]
})
export class UsersModule { }
