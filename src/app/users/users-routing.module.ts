import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {
    path: '', // Route principale del modulo users
    component: UsersListComponent, // Mostra UsersListComponent come vista predefinita
  },
  {
    path: 'user-form/:id', // Route per la modifica dell'utente
    component: UserFormComponent,
  },
  {
    path: 'user-form', // Route per la creazione di un nuovo utente
    component: UserFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
