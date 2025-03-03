import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MessageService } from '../shared/services/message.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('authGuard', () => {
  let authService: AuthService;
  let messageService: MessageService;
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        HttpClientTestingModule
      ],  // Per mockare il router e HttpClient
      providers: [
        AuthService,
        MessageService
      ]
    });

    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy(); // Verifica che la guardia sia creata correttamente
  });

  // Verifica che l'utente autenticato possa accedere a rotte protette
  it('should allow access if user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true); // L'utente è autenticato

    const result = executeGuard(null as any, null as any);

    expect(result).toBeTrue();
  });

  // Verifica che l'utente non autenticato non possa accedere a rotte protette
  it('should redirect to login and show error if user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false); // L'utente non è autenticato
    spyOn(router, 'navigate'); // Mock della navigazione
    spyOn(messageService, 'setMessage'); // Mock del messaggio

    const result = executeGuard(null as any, null as any);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(messageService.setMessage).toHaveBeenCalledWith('messages.error.authentication_required');
  });
});
