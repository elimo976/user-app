import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslocoModule, TranslocoService, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TRANSLOCO_TRANSPILER, TRANSLOCO_MISSING_HANDLER, TRANSLOCO_INTERCEPTOR, TRANSLOCO_FALLBACK_STRATEGY, DefaultFallbackStrategy, TranslocoConfig, translocoConfig, DefaultTranspiler } from '@ngneat/transloco';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from '../users.service';
import { User } from '../user.model';
import { UserRole } from '../user.model';

// Mock del TranslocoLoader per evitare richieste HTTP reali
class FakeTranslocoLoader {
  getTranslation(lang: string) {
    return of({ title: 'Titolo' }); // Mock di una traduzione
  }
}

// Mock del transpiler
class FakeTranslocoTranspiler {
  transpile(text: string) {
    return text; // Restituisce semplicemente il testo senza modificarlo
  }
}

// Handler per le chiavi mancanti
class FakeTranslocoMissingHandler {
  handle(missingKey: string, lang: string) {
    return `MISSING_KEY_${missingKey}`; // Restituisce una stringa di fallback per le chiavi mancanti
  }
}

// Mock dell'intercettore Transloco
class FakeTranslocoInterceptor {
  intercept(req: any, next: any) {
    return next.handle(req); // Passa la richiesta senza modificarla
  }
}

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let route: ActivatedRoute;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usersServiceMock = jasmine.createSpyObj('UsersService', ['getUserById', 'addUser', 'updateUser']);
    const activatedRouteMock = { params: of({ id: '123' }) };
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [HttpClientTestingModule, TranslocoModule, SharedModule],
      providers: [
        TranslocoService,
        { provide: TRANSLOCO_CONFIG, useValue: translocoConfig({ availableLangs: ['it', 'en', 'de'], defaultLang: 'it', fallbackLang: 'en', reRenderOnLangChange: true, prodMode: false }) },
        { provide: TRANSLOCO_LOADER, useClass: FakeTranslocoLoader },
        { provide: TRANSLOCO_TRANSPILER, useClass: FakeTranslocoTranspiler },
        { provide: TRANSLOCO_MISSING_HANDLER, useClass: FakeTranslocoMissingHandler },
        { provide: TRANSLOCO_INTERCEPTOR, useClass: FakeTranslocoInterceptor },
        { provide: TRANSLOCO_FALLBACK_STRATEGY, useClass: DefaultFallbackStrategy },
        { provide: TRANSLOCO_TRANSPILER, useClass: DefaultTranspiler },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // usersService.getUserById mock setup
    usersService.getUserById.and.returnValue(of({
      _id: '123',
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin',
      password: '',
      address: { street: 'Via Roma 123', city: 'Milano', zipCode: '20121', country: 'Italia' }
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new user and navigate to users list', fakeAsync(() => {
    const mockUser: User = {
      _id: '123',
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
    };

    // Mock della risposta del servizio
    usersService.addUser.and.returnValue(of(mockUser));

    // Imposta userId a null per simulare la creazione di un nuovo utente
    component.userId = null;

    // Compila il form con dati validi
    component.userForm.setValue({
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin',
      dateOfBirth: null,
      phoneNumber: '',
      password: 'Password123',
      address: {
        street: 'Via Roma 123',
        city: 'Milano',
        zipCode: '20121',
        country: 'Italia'
      }
    });

    // Simula l'invio del form
    component.onSubmit();

    tick(3000);

    // Verifica che il metodo `navigate` sia stato chiamato
    expect(router.navigate).toHaveBeenCalledWith(['/usersList']);
  }));


  it('should update an existing user and navigate to users list', fakeAsync(() => {
    const user: User = {
      firstName: 'Luigi',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin' as UserRole,
      dateOfBirth: '',
      password: '',
      phoneNumber: '',
      address: {
        street: 'Via Roma 123',
        city: 'Milano',
        zipCode: '20121',
        country: 'Italia'
      },
      _id: '123',  // Aggiungi l'_id direttamente all'oggetto user
    };

    // Simula il comportamento del servizio
    usersService.updateUser.and.returnValue(of(user));

    // Imposta i valori del form, ma escludi _id
    component.userForm.setValue({
      firstName: 'Luigi',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin',
      dateOfBirth: '',
      password: '',
      phoneNumber: '',
      address: {
        street: 'Via Roma 123',
        city: 'Milano',
        zipCode: '20121',
        country: 'Italia'
      }
    });

    fixture.detectChanges();  // Aggiorna il componente

    // Setta l'id dell'utente manualmente
    component.userId = '123';

    // Aggiungi manualmente _id ai dati del form
    component.userForm.value._id = component.userId;  // Aggiungi _id al form

    // Simula l'aggiornamento dell'utente
    component.updateUser();
    tick(3000);  // Avanza il tempo per completare le operazioni asincrone

    // Verifica che il metodo `updateUser` sia stato chiamato correttamente
    expect(usersService.updateUser).toHaveBeenCalledWith('123', user);
    expect(router.navigate).toHaveBeenCalledWith(['/usersList']);
  }));

});
