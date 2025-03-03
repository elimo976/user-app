import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TranslocoModule, TranslocoService, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TRANSLOCO_TRANSPILER, TRANSLOCO_MISSING_HANDLER, TRANSLOCO_INTERCEPTOR, TRANSLOCO_FALLBACK_STRATEGY, DefaultFallbackStrategy, TranslocoConfig, translocoConfig, DefaultTranspiler } from '@ngneat/transloco';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SharedModule } from '../shared.module';

// Mock del TranslocoLoader per evitare richieste HTTP reali
class FakeTranslocoLoader {
  getTranslation(lang: string) {
    return of({ title: 'Titolo' });
  }
}

// Mock del transpiler
class FakeTranslocoTranspiler {
  transpile(text: string) {
    return text;
  }
}

// Handler per le chiavi mancanti
class FakeTranslocoMissingHandler {
  handle(missingKey: string, lang: string) {
    return `MISSING_KEY_${missingKey}`;
  }
}

// Mock per l'interceptor
class FakeTranslocoInterceptor {}

describe('HeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TranslocoModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [HeaderComponent],
      providers: [
        TranslocoService,
        {
          provide: TRANSLOCO_CONFIG,
          useValue: translocoConfig ({
            availableLangs: ['it', 'en', 'de'],
            defaultLang: 'it',
            fallbackLang: 'en',
            reRenderOnLangChange: true,
            prodMode: false
          }) as TranslocoConfig
        },
        { provide: TRANSLOCO_LOADER, useClass: FakeTranslocoLoader },
        { provide: TRANSLOCO_TRANSPILER, useClass: FakeTranslocoTranspiler },
        { provide: TRANSLOCO_MISSING_HANDLER, useClass: FakeTranslocoMissingHandler },
        { provide: TRANSLOCO_INTERCEPTOR, useClass: FakeTranslocoInterceptor },
        { provide: TRANSLOCO_FALLBACK_STRATEGY, useClass: DefaultFallbackStrategy },
        { provide: TRANSLOCO_TRANSPILER, useClass: DefaultTranspiler }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
