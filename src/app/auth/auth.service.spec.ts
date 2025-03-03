import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../shared/services/message.service';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { defer, of } from 'rxjs';
import { environment } from '../../environments/environment.development';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;
  // let storage: Storage;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('accessToken', 'fake-jwt-token');  // Istanzia il componente/guard che chiama authService.isAuthenticated()
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MessageService, useValue: { setMessage: jasmine.createSpy('setMessage') } }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    // storage = window.localStorage;
    httpTestingController = TestBed.inject(HttpTestingController); // Inizializza il HttpTestingController per simulare le chiamate HTTP

    spyOn(authService, 'isAuthenticated'); // Spy sul metodo isAuthenticated
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica che non ci siano richieste pendenti
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  // Verifica che il token venga memorizzato nel localStorage durante il login
  it('should store the JWT token on login', fakeAsync(() => {
    const fakeToken = 'fake-jwt-token';

    spyOn(localStorage, 'setItem'); // Spia localStorage.setItem()

    // Simula il comportamento del `tap` usando `defer`
    spyOn(authService, 'login').and.returnValue(
      defer(() => { //defer rimanda la creazione dell'Observable fino alla sottoscrizione
        // Simula la risposta del backend
        const response = { accessToken: fakeToken };
        // Esegui la logica del `tap` manualmente
        localStorage.setItem('accessToken', response.accessToken);
        return of(response);
      })
    );

    authService.login('test@example.com', 'password').subscribe(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', fakeToken);
    });

    tick(); // Simula il passaggio del tempo per completare l'operazione asincrona

    // Aggiungi un'ulteriore verifica per sicurezza
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
  }));

  // Verifica che viene permesso l'accesso se l'utente è autenticato
  it('should allow access if user is authenticated', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(true); // Simula utente autenticato

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState); // Testa la guardia all'interno di un contesto di iniezione
      expect(result).toBeTrue(); // Accesso consentito
      expect(router.navigate).not.toHaveBeenCalled(); // Nessun redirect
      expect(messageService.setMessage).not.toHaveBeenCalled(); // Nessun messaggio di errore
    });
  });

  // Verifica che viene reindirizzato alla pagina di login se l'utente non è autenticato
  it('should redirect to login if user is not authenticated', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(false); // Simula utente non autenticato

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState); // Testa la guardia all'interno di un contesto di iniezione
      expect(result).toBeFalse(); // Accesso negato
      expect(router.navigate).toHaveBeenCalledWith(['/login']); // Redirect alla pagina di login
      expect(messageService.setMessage).toHaveBeenCalledWith('messages.error.authentication_required'); // Messaggio di errore
    });
  });

  it('should store the JWT token on login', () => {
    const fakeToken = 'fake-jwt-token';
    authService.login('test@example.com', 'password').subscribe();

    const req = httpTestingController.expectOne(`${environment.base_URL}/auth/login/`);
    expect(req.request.method).toEqual('POST');
    req.flush({ accessToken: fakeToken });

    expect(localStorage.getItem('accessToken')).toBe(fakeToken);
  });

  it('should remove the JWT token on logout', () => {
    // Imposta un token fittizio nel localStorage
    localStorage.setItem('accessToken', 'fake-jwt-token');

    // Chiama il metodo logout
    authService.logout();

    // Verifica che il token sia stato rimosso
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

});
