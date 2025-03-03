import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserActionRendererComponent } from './user-action-renderer.component';
import { UsersService } from '../users.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router'; // Importa il Router
import {
  TranslocoModule,
  TranslocoService,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  TRANSLOCO_TRANSPILER,
  TRANSLOCO_MISSING_HANDLER,
  TRANSLOCO_INTERCEPTOR,
  TRANSLOCO_FALLBACK_STRATEGY,
  translocoConfig
} from '@ngneat/transloco';

// Mock del TranslocoLoader per evitare richieste HTTP reali
class FakeTranslocoLoader {
  getTranslation(lang: string) {
    return of({}); // Risultato vuoto, nessuna traduzione necessaria per i test
  }
}

// Mock del transpiler per evitare errori
class FakeTranslocoTranspiler {
  transpile(text: string) {
    return text; // Semplice mock che restituisce il testo senza modifiche
  }
}

// Mock dell'interceptor
class FakeTranslocoInterceptor {
  intercept() {
    return (translation: any) => translation; // Restituisce la traduzione senza modifiche
  }
}

// Handler per le chiavi mancanti
class FakeTranslocoMissingHandler {
  handle(missingKey: string, lang: string) {
    return `MISSING_KEY_${missingKey}`; // Restituisce una stringa di fallback per le chiavi mancanti
  }
}

// Mock della strategia di fallback
class FakeTranslocoFallbackStrategy {
  getNextLangs(fallbackLang: string | null) {
    return [fallbackLang || 'en']; // Restituisce la lingua di fallback o 'en' come default
  }
}

describe('UserActionRendererComponent', () => {
  let component: UserActionRendererComponent;
  let fixture: any;
  let usersService: UsersService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoModule,
        HttpClientTestingModule
      ],
      declarations: [UserActionRendererComponent],
      providers: [
        UsersService,
        {
          provide: TRANSLOCO_CONFIG,
          useValue: translocoConfig({
            availableLangs: ['en', 'it', 'de'],
            defaultLang: 'en',
            fallbackLang: 'en',
            reRenderOnLangChange: true,
            prodMode: false,
          }),
        },
        { provide: TRANSLOCO_LOADER, useClass: FakeTranslocoLoader }, // Mock del loader
        { provide: TRANSLOCO_TRANSPILER, useClass: FakeTranslocoTranspiler }, // Mock del transpiler
        { provide: TRANSLOCO_INTERCEPTOR, useClass: FakeTranslocoInterceptor }, // Mock dell'interceptor
        { provide: TRANSLOCO_MISSING_HANDLER, useClass: FakeTranslocoMissingHandler }, // Mock del missing handler
        { provide: TRANSLOCO_FALLBACK_STRATEGY, useClass: FakeTranslocoFallbackStrategy }, // Mock della strategia di fallback
        TranslocoService, // Fornisci il servizio TranslocoService
        Router, // Aggiungi il router ai providers
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActionRendererComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);  // Ottieni l'istanza del servizio UsersService
    router = TestBed.inject(Router);  // Ottieni l'istanza del Router
    spyOn(router, 'navigate');  // Spia il metodo navigate
    spyOn(usersService, 'deleteUser').and.returnValue(of(null)); // Mock del metodo deleteUser
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a user and update the users list', fakeAsync(() => {
    const userId = '123';  // ID dell'utente da eliminare

    // Mock dei parametri per il componente
    component.params = {
      data: {
        _id: userId,  // Aggiungi un _id valido
      },
      context: {
        componentParent: {
          refreshUsersList: jasmine.createSpy('refreshUsersList'), // Spia per il metodo refreshUsersList
        },
      },
    };

    // Simula la chiamata del metodo delete nel componente
    component.deleteUser();
    tick(3000);  // Avanza il tempo per completare le operazioni asincrone

    // Verifica che deleteUser sia stato chiamato con l'ID corretto
    expect(usersService.deleteUser).toHaveBeenCalledWith(userId);

    // Verifica che il metodo refreshUsersList sia stato chiamato nel componente padre
    const parentComponent = component.params.context.componentParent;
    expect(parentComponent.refreshUsersList).toHaveBeenCalled();
  }));

});
