import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from '../shared/services/message.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isAuthenticated()) {
    return true; // Permette l'accesso se utente è autenticato
  } else {
    messageService.setMessage('messages.error.authentication_required');

    // Aspetta una attimo prima di navigare, per permettere al messaggio di propagarsi
    router.navigate(['/login']); // Reindirizza alla pagina di login se l'utente non è autenticato
    return false;
  }
};
