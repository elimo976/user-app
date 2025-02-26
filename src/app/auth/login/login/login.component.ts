import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message: string | null = null;
  messageSubscription?: Subscription;

  loginForm = new FormGroup({
   email: new FormControl('',[Validators.required, Validators.email]),
   password: new FormControl('',[Validators.required, Validators.minLength(3)])
 })

 constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Ascolta i cambiamenti del messaggio
    // Traduzione messaggio gestito nella guardia
    this.messageSubscription = this.messageService.message$.subscribe(messageKey => {
      //  console.log('[LoginComponent] Ricevuto messaggio:', messageKey); // DEBUG
      if (messageKey) {
        this.translocoService.selectTranslate(messageKey).subscribe(translatedMessage => {
          // console.log('[LoginComponent] Messaggio tradotto:', translatedMessage); // DEBUG
          this.message = translatedMessage;
        });
      }
    });
 }

 ngOnDestroy(): void {
  if (this.messageSubscription) {
    this.messageSubscription.unsubscribe();
  }
 }

onSubmit(): void {
  const { email, password } = this.loginForm.value;
  if (email && password) {
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/usersList']),
      error: () => {
        const errorMessageKey = 'messages.error.invalid_credentials';  // Usa la chiave di traduzione
        // console.log(`[LoginComponent] Impostando messaggio errore con chiave: ${errorMessageKey}`); // DEBUG
        this.messageService.setMessage(errorMessageKey); // Imposta la chiave nel service

        // Traduco la chiave con TranslocoService
        this.translocoService.selectTranslate(errorMessageKey).subscribe(translatedMessage => {
          // console.log(`[LoginComponent] Messaggio tradotto: ${translatedMessage}`); // DEBUG
          this.message = translatedMessage; // Imposta il messaggio tradotto nel componente
        });
      }
    });
  }
}

}
