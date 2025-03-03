import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should throw "Token mancante" error if no token is provided', () => {
    localStorage.removeItem('accessToken'); // Assicurati che il token non sia presente

    httpClient.get('/data').subscribe({
      next: () => fail('should have failed with a "Token mancante" error'),
      error: (error) => {
        expect(error.message).toBe('Token mancante');
      }
    });

    // Non ci aspettiamo che la richiesta venga effettivamente inviata
    httpMock.expectNone('/data');
  });

  it('should throw "Token scaduto" error if the token is expired', () => {
    const expiredToken = 'expired-jwt-token';
    localStorage.setItem('accessToken', expiredToken);

    // Aggiungi il log per verificare che il token scaduto venga correttamente gestito
    console.log('Simulando token scaduto...');

    // Mocka sia il metodo isTokenExpired che l'observable
    spyOn(interceptor as any, 'isTokenExpired').and.returnValue(true);

    // Verifica che l'interceptor venga chiamato correttamente
    spyOn(interceptor, 'intercept').and.callThrough();

    httpClient.get('/data').subscribe({
      next: () => fail('Test fallito: doveva lanciare errore'),
      error: (error) => {
        console.log('Errore ricevuto: ', error);
        expect(error.message).toBe('Token scaduto');
        // Aggiungi verifica che il token venga rimosso
        expect(localStorage.getItem('accessToken')).toBeNull();
      }
    });

    // Verifica che non ci siano richieste HTTP
    httpMock.expectNone('/data');
  });

});
