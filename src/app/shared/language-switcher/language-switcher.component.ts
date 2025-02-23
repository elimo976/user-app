import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  languages = [
    { label: 'Italiano', value: 'it' },
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de'}
  ];

  // La lingua selezionata, inizialmente impostata su quella di default
  selectedLang = this.languages[0].value;
  constructor(private translocoService: TranslocoService) {}

  // Metodo per cambiare lingua
  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }
}
