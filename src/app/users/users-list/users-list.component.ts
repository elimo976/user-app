import { Component, ViewEncapsulation } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ColDef } from 'ag-grid-community';
import { ModuleRegistry, ValidationModule, PaginationModule, ColumnAutoSizeModule } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { UserActionRendererComponent } from '../user-action-renderer/user-action-renderer.component';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from '../../shared/services/message.service';


// Registra il modulo prima di usarlo
ModuleRegistry.registerModules([ValidationModule ,ClientSideRowModelModule, PaginationModule, ColumnAutoSizeModule]);


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent {
 users: User[] = [];
 selectedUser: User | null = null;
 displayUserDetail = false;
 message: string | null = null;
 messageClass: { [key: string]: boolean } = {};
 private messageSubscription?: Subscription;

 columnDefs: ColDef[] = [
  { headerName: ' First Name', field: 'firstName' },
  { headerName: 'Last Name', field: 'lastName' },
  { headerName: 'Email', field: 'email' },
  { headerName: 'Role', field: 'role'},
  { headerName: 'Actions',
     cellRenderer: UserActionRendererComponent,
     cellRendererParams: {
      context: { componentParent: this }
     }
    }
 ]

 // Per permettere a UserActionRenderer di accedere ai metodi di questo componente.
 gridOptions = {
  context: { componentParent: this }
 }


 constructor(
  private userService: UsersService,
  private authService: AuthService,
  private messageService: MessageService,
  private router: Router,
  private route: ActivatedRoute

 ) {}

 ngOnInit(): void {
  this.loadUsers();

  // Sottoscrizione all'Obs del servizio condiviso
  this.messageSubscription = this.messageService.message$.subscribe(message => {
    // console.log('Messaggio ricevuto:', message); //
    this.handleMessage(message);
  })
 }

 ngOnDestroy() {
  this.messageSubscription?.unsubscribe();
 }

 loadUsers(): void {
  this.userService.getAllUsers().subscribe(users => {
    this.users = users;
  })
 }

 onGridReady(params: any) {
  params.api.sizeColumnsToFit();
 }

 openUserDetail(user: User): void {
  this.selectedUser = user;
  this.displayUserDetail = true;
 }

 closeUserDetail(): void {
  this.displayUserDetail = false;
  this.selectedUser = null;
 }

 logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
 }

 goToForm() {
  this.router.navigate(['user-form'], { relativeTo: this.route.parent});
 }

navigateToEditUser(userId: string): void {
  // console.log('Naviga all\'utente da modificare con ID:', userId); // Debug
  this.router.navigate(['user-form', userId], { relativeTo: this.route.parent }).then((success) => {
    if (success) {
      console.log('Navigazione riuscita');
    } else {
      console.error('Navigazione fallita');
    }
  }).catch((error) => {
    console.error('Errore durante la navigazione:', error);
  });
}

 refreshUsersList(): void {
  this.userService.getAllUsers().subscribe({
    next: (users) => {
      this.users = users; // Aggiorna i dati della tabella
    },
    error: (error) => {
      console.error('Errore nel ricaricare la lista utenti:', error);
    }
  });
}

handleMessage(message: string | null): void {
  if (message) {
    this.message = message;
    this.messageClass = {
      'success-message': message.includes('successfully'),
      'error-message': message.includes('error'),
    };
  } else {
    this.message = null;
    this.messageClass = {};
  }
}

}
