import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    translocoService = jasmine.createSpyObj('TranslocoService', [
      'selectTranslate',
      'setActiveLang',
      'getActiveLang',
      'translate',
    ]);

    // Simula i comportamenti del servizio
    translocoService.selectTranslate.and.returnValue(of('Mock Translation'));
    translocoService.getActiveLang.and.returnValue('it'); // Lingua predefinita
    translocoService.translate.and.returnValue('Mock Translation');

    await TestBed.configureTestingModule({
      declarations: [LanguageSwitcherComponent],
      imports: [
        TranslocoModule, // Usa il modulo standard
        HttpClientTestingModule,
        DropdownModule,
        FormsModule,
        DropdownModule,
      ],
      providers: [
        { provide: TranslocoService, useValue: translocoService }, // Mock del servizio
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeLang with the correct language', () => {
    const lang = 'en';
    component.changeLang(lang);

    // Verifica che setActiveLang sia stato chiamato con il parametro giusto
    expect(translocoService.setActiveLang).toHaveBeenCalledWith(lang);
  });

  it('should change language when changeLang is called', () => {
    const lang = 'de';
    component.changeLang(lang);

    fixture.detectChanges();

    // Verifica che la lingua selezionata sia cambiata
    expect(component.selectedLang).toBe(lang);
  });
});
