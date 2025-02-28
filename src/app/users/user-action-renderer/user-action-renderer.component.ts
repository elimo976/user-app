import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { MessageService } from '../../shared/services/message.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-action-renderer',
  templateUrl: './user-action-renderer.component.html',
  styleUrl: './user-action-renderer.component.css'
})
export class UserActionRendererComponent implements ICellRendererAngularComp {
  params: any;
  users: User[] =[];

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    // console.log('Params nel componente figlio:', this.params); // DEBUG
  }

  refresh(): boolean {
    return false;
  }

  viewUser(): void {
    if (this.params.context?.componentParent?.openUserDetail) {
      this.params.context.componentParent.openUserDetail(this.params.data);
    } else {
      console.error('openUserDetail non è definito nel componente padre');
    }
  }

  editUser(): void {
    console.log('Modifica utente:', this.params.data);
  }

  deleteUser(): void {
    const userId = this.params.data._id;
    if (!userId) {
      console.error('Id utente non trovato');
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        const successMessage = this.translocoService.translate('messages.deletedSuccessfully');
        console.log('Messaggio di successo:', successMessage);
        this.messageService.setMessage(successMessage); // Usa il servizio condiviso per inviare il messaggio

        // Aggiorna la lista utenti nel componente padre
        if (this.params.context?.componentParent?.refreshUsersList) {
          this.params.context.componentParent.refreshUsersList();
        } else {
          console.warn('refreshUsersList non è definito nel componente padre');
        }
      },
      error: (error) => {
        console.error('Errore durante l\'eliminazione dell\'utente:', error);
        const errorMessage = this.translocoService.translate('messages.error.deleteError');
        this.messageService.setMessage(errorMessage); // Usa il servizio condiviso per inviare il messaggio di errore
      },
    });
  }

}
