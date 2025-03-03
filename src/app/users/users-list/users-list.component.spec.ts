import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../users.service';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from '../../shared/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { User } from '../user.model';
import { provideRouter } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { DialogModule } from 'primeng/dialog';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let authService: jasmine.SpyObj<AuthService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const usersServiceMock = jasmine.createSpyObj('UsersService', ['getAllUsers']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    const messageServiceMock = jasmine.createSpyObj('MessageService', [], { message$: of(null) });

    await TestBed.configureTestingModule({
      declarations: [UsersListComponent, UserDetailComponent],
      imports: [
        HttpClientTestingModule, // Permette di simulare richieste HTTP durante i test, così da non effettuare chiamate reali al server
        TranslocoTestingModule, // Permette di testare componenti che utilizzano il sistema di traduzioni di Transloco, senza dover caricare file di traduzione reali
        SharedModule,
        AgGridModule,
        DialogModule
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceMock }, // Mockato per simulalre il metodo getAllUsers
        { provide: AuthService, useValue: authServiceMock }, // Mockato per simulare il metodo logout
        { provide: MessageService, useValue: messageServiceMock }, // Mockato per simulare il comportamento del servizio; anche se non usato direttamente, serve per prevenire errori di iniezione,isolare i test dal comportamento di MessageService e per preparare il terreno per eventuali futuri test che potrebbero verificare l'interazione con MS.
        provideRouter([]), // Permette di configurare il router durante i test, così da testare la navigazione
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } } // Permette di accedere ai parametri  della route (cfr. userId)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    userService.getAllUsers.and.returnValue(of([]));
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  // Verifica che il componente venga creato correttamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verifica che il componente carichi correttamente la listai di utenti all'inizializzazione
  it('should load users on init', () => {
    const mockUsers: User[] = [
      {
        _id: '1',
        firstName: 'Mario',
        lastName: 'Rossi',
        email: 'mario.rossi@example.com',
        role: 'admin',
        password: '',
        address: {
          street: 'Via Roma 123',
          city: 'Milano',
          zipCode: '20121',
          country: 'Italia'
        }
      },
      {
        _id: '2',
        firstName: 'Laura',
        lastName: 'Bianchi',
        email: 'laura.bianchi@example.com',
        role: 'user',
        password: '',
        address: {
          street: 'Corso Italia 456',
          city: 'Roma',
          zipCode: '00100',
          country: 'Italia'
        }
      }
    ];

    // Sovrascrive il comportamento del mock per restituire i dati mockati
    userService.getAllUsers.and.returnValue(of(mockUsers));

    // Esegue il rilevamento dei cambiamenti nel componente
    fixture.detectChanges();

    // Verifica che il servizio sia stato chiamato
    expect(userService.getAllUsers).toHaveBeenCalled();

    // Verifica che la lista di utenti sia corretta
    expect(component.users.length).toBe(2);
    expect(component.users).toEqual(mockUsers);
  });

  // Verifica che il metodo logout di AuthService venga chiamato quando l'utente effettua il logout
  it('should call AuthService.logout on logout', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Verifica che il componente navighi correttamente verso il form per creare un nuovo utente
  it('should navigate to user form', () => {
    component.goToForm();
    expect(router.navigate).toHaveBeenCalledWith(['user-form'], { relativeTo: route.parent });
  });

  // Verifica che il componente navighi correttamente verso il form per modificare un utente esistente
  it('should navigate to edit user form', () => {
    const userId = '1';
    component.navigateToEditUser(userId); // Responsabile di navigare verso il form di modifica di un utente specifico
    expect(router.navigate).toHaveBeenCalledWith(['user-form', userId], { relativeTo: route.parent });
  });

  // Verifica che il componente aggiorna correttamente la lista degli utenti
  it('should refresh users list', () => {
    const mockUsers: User[] = [
      { _id: '1', firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@example.com', role: 'admin', password:'', address: { street: 'Via Roma 123', city: 'Milano', zipCode: '20121', country: 'Italia' } },
      { _id: '2', firstName: 'Laura', lastName: 'Bianchi', email: 'laura.bianchi@example.com', role: 'user', password:'', address: { street: 'Corso Italia 456', city: 'Roma', zipCode: '00100', country: 'Italia' } }
    ];

    userService.getAllUsers.and.returnValue(of(mockUsers));
    component.refreshUsersList(); // Viene chiamato per verificare che la lista venga aggiornata correttamente dopo una verifica
    expect(component.users).toEqual(mockUsers);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });
});

/*
Nel presente file di test ho verificato:
- La creazione del componente
- Il caricamento dei dati all'inizializzazione
- La navigazione verso altre rotte
- Il comportamento dei servizi dipendenti
*/
